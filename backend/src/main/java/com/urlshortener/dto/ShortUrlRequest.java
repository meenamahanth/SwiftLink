package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;

public class ShortUrlRequest {
    @NotBlank(message = "Long URL cannot be blank")
    @URL(message = "Please provide a valid URL")
    private String longUrl;

    @Pattern(regexp = "^[a-zA-Z0-9_-]{3,50}$|^$", message = "Custom alias must be alphanumeric and between 3 and 50 characters, or empty")
    private String customAlias;

    private String title;

    private Instant expiresAt;

    public String getLongUrl() { return longUrl; }
    public void setLongUrl(String longUrl) { this.longUrl = longUrl; }
    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
