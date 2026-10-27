package com.urlshortener.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Secure Note entity.
 * Notes are anonymous — no user association, no share ID.
 * The note_hash (SHA-256 of the secret code) is the sole lookup key.
 * Expiry is determined at query time by comparing expires_at with Instant.now().
 */
@Entity
@Table(name = "secure_notes")
public class SecureNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "note_hash", nullable = false, unique = true, length = 64)
    private String noteHash;

    @Column(name = "encrypted_content", nullable = false, columnDefinition = "TEXT")
    private String encryptedContent;

    @Column(length = 255)
    private String title;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public SecureNote() {}

    public SecureNote(Long id, String noteHash, String encryptedContent, String title,
                      Instant createdAt, Instant updatedAt, Instant expiresAt) {
        this.id = id;
        this.noteHash = noteHash;
        this.encryptedContent = encryptedContent;
        this.title = title;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNoteHash() { return noteHash; }
    public void setNoteHash(String noteHash) { this.noteHash = noteHash; }
    public String getEncryptedContent() { return encryptedContent; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String noteHash;
        private String encryptedContent;
        private String title;
        private Instant createdAt;
        private Instant updatedAt;
        private Instant expiresAt;

        Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder noteHash(String noteHash) { this.noteHash = noteHash; return this; }
        public Builder encryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }

        public SecureNote build() {
            return new SecureNote(id, noteHash, encryptedContent, title, createdAt, updatedAt, expiresAt);
        }
    }
}
