package com.urlshortener.dto;

import java.time.Instant;

/**
 * Returned when a note is successfully opened.
 * Contains the encrypted content (decrypted client-side) and metadata.
 */
public class OpenNoteResponse {

    private String title;
    private String encryptedContent;
    private Instant expiresAt;
    private String remainingTime;

    public OpenNoteResponse() {}

    public OpenNoteResponse(String title, String encryptedContent, Instant expiresAt, String remainingTime) {
        this.title = title;
        this.encryptedContent = encryptedContent;
        this.expiresAt = expiresAt;
        this.remainingTime = remainingTime;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getEncryptedContent() { return encryptedContent; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public String getRemainingTime() { return remainingTime; }
    public void setRemainingTime(String remainingTime) { this.remainingTime = remainingTime; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String title;
        private String encryptedContent;
        private Instant expiresAt;
        private String remainingTime;

        Builder() {}

        public Builder title(String title) { this.title = title; return this; }
        public Builder encryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; return this; }
        public Builder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public Builder remainingTime(String remainingTime) { this.remainingTime = remainingTime; return this; }

        public OpenNoteResponse build() {
            return new OpenNoteResponse(title, encryptedContent, expiresAt, remainingTime);
        }
    }
}
