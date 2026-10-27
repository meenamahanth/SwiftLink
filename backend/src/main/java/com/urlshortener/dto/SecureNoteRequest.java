package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SecureNoteRequest {

    @Size(max = 255, message = "Title must be at most 255 characters")
    private String title;

    @NotBlank(message = "Note hash is required")
    @Pattern(regexp = "^[a-fA-F0-9]{64}$", message = "Note hash must be a valid SHA-256 hex string")
    private String noteHash;

    @NotBlank(message = "Encrypted content is required")
    private String encryptedContent;

    @NotNull(message = "Expiration hours is required")
    private Integer expirationHours;

    public SecureNoteRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getNoteHash() { return noteHash; }
    public void setNoteHash(String noteHash) { this.noteHash = noteHash; }
    public String getEncryptedContent() { return encryptedContent; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }
    public Integer getExpirationHours() { return expirationHours; }
    public void setExpirationHours(Integer expirationHours) { this.expirationHours = expirationHours; }
}
