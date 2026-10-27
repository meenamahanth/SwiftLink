package com.urlshortener.service;

import com.urlshortener.dto.*;
import com.urlshortener.entity.SecureNote;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.SecureNoteRepository;
import com.urlshortener.util.NoteExpirationHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Redesigned Secure Note service — anonymous, public, hash-only access.
 *
 * - Notes are identified solely by their note_hash (SHA-256 of the secret code).
 * - No user association.
 * - Expiry is checked at runtime by comparing expires_at with Instant.now().
 * - If a note with the same hash already exists, createOrUpdate overwrites it.
 */
@Service
public class SecureNoteService {

    @Autowired
    private SecureNoteRepository secureNoteRepository;

    /**
     * Create a new note or overwrite the existing note for the same hash.
     * Frontend has already encrypted the content; backend stores only ciphertext + hash.
     */
    @Transactional
    public SecureNoteResponse createOrUpdate(SecureNoteRequest request) {
        validateExpirationHours(request.getExpirationHours());

        Instant expiresAt = NoteExpirationHelper.calculateExpiresAt(request.getExpirationHours());
        String hash = request.getNoteHash().toLowerCase();

        SecureNote note = secureNoteRepository.findByNoteHash(hash)
                .orElse(null);

        if (note == null) {
            note = SecureNote.builder()
                    .noteHash(hash)
                    .encryptedContent(request.getEncryptedContent())
                    .title(sanitizeTitle(request.getTitle()))
                    .expiresAt(expiresAt)
                    .build();
        } else {
            // Overwrite existing note for this hash
            note.setEncryptedContent(request.getEncryptedContent());
            note.setTitle(sanitizeTitle(request.getTitle()));
            note.setExpiresAt(expiresAt);
        }

        SecureNote saved = secureNoteRepository.save(note);
        return mapToResponse(saved);
    }

    /**
     * Open a note by its hash.
     * Returns the encrypted content so the client can decrypt it locally.
     * If the note is expired it is deleted and a 404 is returned.
     */
    @Transactional
    public OpenNoteResponse openByHash(String noteHash) {
        String hash = noteHash.toLowerCase();

        SecureNote note = secureNoteRepository.findByNoteHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("No note found for this Secret Code"));

        if (isExpired(note)) {
            secureNoteRepository.delete(note);
            throw new ResourceNotFoundException("This note has expired and has been permanently deleted");
        }

        return OpenNoteResponse.builder()
                .title(note.getTitle())
                .encryptedContent(note.getEncryptedContent())
                .expiresAt(note.getExpiresAt())
                .remainingTime(NoteExpirationHelper.computeRemainingTime(note.getExpiresAt()))
                .build();
    }

    /**
     * Delete a note by its hash.
     * The caller must know the hash (derived from the secret code) to delete.
     */
    @Transactional
    public void deleteByHash(String noteHash) {
        String hash = noteHash.toLowerCase();
        SecureNote note = secureNoteRepository.findByNoteHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("No note found for this Secret Code"));
        secureNoteRepository.delete(note);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private boolean isExpired(SecureNote note) {
        return note.getExpiresAt() != null && note.getExpiresAt().isBefore(Instant.now());
    }

    private String sanitizeTitle(String title) {
        return (title != null && !title.isBlank()) ? title.trim() : null;
    }

    private void validateExpirationHours(Integer expirationHours) {
        try {
            NoteExpirationHelper.validateExpirationHours(expirationHours);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    private SecureNoteResponse mapToResponse(SecureNote note) {
        return SecureNoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .expiresAt(note.getExpiresAt())
                .remainingTime(NoteExpirationHelper.computeRemainingTime(note.getExpiresAt()))
                .build();
    }
}
