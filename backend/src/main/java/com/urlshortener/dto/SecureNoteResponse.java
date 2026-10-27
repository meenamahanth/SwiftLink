package com.urlshortener.dto;

import java.time.Instant;

/**
 * Returned after creating or updating a Secure Note.
 * No shareId or shareUrl — notes are accessed only via Secret Code.
 */
public class SecureNoteResponse {

    private Long id;
    private String title;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant expiresAt;
    private String remainingTime;

    public SecureNoteResponse() {}

    public SecureNoteResponse(Long id, String title, Instant createdAt, Instant updatedAt,
                               Instant expiresAt, String remainingTime) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.expiresAt = expiresAt;
        this.remainingTime = remainingTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public String getRemainingTime() { return remainingTime; }
    public void setRemainingTime(String remainingTime) { this.remainingTime = remainingTime; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title;
        private Instant createdAt;
        private Instant updatedAt;
        private Instant expiresAt;
        private String remainingTime;

        Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public Builder remainingTime(String remainingTime) { this.remainingTime = remainingTime; return this; }

        public SecureNoteResponse build() {
            return new SecureNoteResponse(id, title, createdAt, updatedAt, expiresAt, remainingTime);
        }
    }
}
