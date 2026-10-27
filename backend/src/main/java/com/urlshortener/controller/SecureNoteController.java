package com.urlshortener.controller;

import com.urlshortener.dto.*;
import com.urlshortener.service.SecureNoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Secure Notes controller — all endpoints are PUBLIC (no authentication required).
 *
 * POST /api/notes        — Create or overwrite a note (upsert by hash)
 * POST /api/notes/open   — Open (retrieve) a note by hash
 * DELETE /api/notes/{noteHash} — Delete a note by hash
 */
@RestController
@RequestMapping("/api/notes")
public class SecureNoteController {

    @Autowired
    private SecureNoteService secureNoteService;

    /** Create or overwrite the note for the given secret-code hash. */
    @PostMapping
    public ResponseEntity<SecureNoteResponse> createOrUpdate(
            @Valid @RequestBody SecureNoteRequest request) {
        SecureNoteResponse response = secureNoteService.createOrUpdate(request);
        return ResponseEntity.ok(response);
    }

    /** Open (retrieve encrypted content of) a note by its hash. Returns 404 if not found or expired. */
    @PostMapping("/open")
    public ResponseEntity<OpenNoteResponse> openNote(
            @Valid @RequestBody OpenNoteRequest request) {
        OpenNoteResponse response = secureNoteService.openByHash(request.getNoteHash());
        return ResponseEntity.ok(response);
    }

    /** Delete a note by its hash. */
    @DeleteMapping("/{noteHash}")
    public ResponseEntity<MessageResponse> deleteNote(@PathVariable String noteHash) {
        secureNoteService.deleteByHash(noteHash);
        return ResponseEntity.ok(new MessageResponse("Secure note deleted successfully"));
    }
}
