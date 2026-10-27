package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class OpenNoteRequest {

    @NotBlank(message = "Note hash is required")
    @Pattern(regexp = "^[a-fA-F0-9]{64}$", message = "Note hash must be a valid SHA-256 hex string")
    private String noteHash;

    public OpenNoteRequest() {}

    public String getNoteHash() { return noteHash; }
    public void setNoteHash(String noteHash) { this.noteHash = noteHash; }
}
