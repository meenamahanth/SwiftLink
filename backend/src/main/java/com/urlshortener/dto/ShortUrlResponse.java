package com.urlshortener.dto;

import java.time.Instant;

public class ShortUrlResponse {
    private Long id;
    private String shortCode;
    private String shortUrl;
    private String longUrl;
    private String customAlias;
    private String title;
    private Instant createdAt;
    private Instant expiresAt;
    private Boolean isEnabled;
    private Integer clickCount;

    public ShortUrlResponse() {}

    public ShortUrlResponse(Long id, String shortCode, String shortUrl, String longUrl, String customAlias, String title, Instant createdAt, Instant expiresAt, Boolean isEnabled, Integer clickCount) {
        this.id = id;
        this.shortCode = shortCode;
        this.shortUrl = shortUrl;
        this.longUrl = longUrl;
        this.customAlias = customAlias;
        this.title = title;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.isEnabled = isEnabled;
        this.clickCount = clickCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }
    public String getShortUrl() { return shortUrl; }
    public void setShortUrl(String shortUrl) { this.shortUrl = shortUrl; }
    public String getLongUrl() { return longUrl; }
    public void setLongUrl(String longUrl) { this.longUrl = longUrl; }
    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Boolean getIsEnabled() { return isEnabled; }
    public void setIsEnabled(Boolean isEnabled) { this.isEnabled = isEnabled; }
    public Integer getClickCount() { return clickCount; }
    public void setClickCount(Integer clickCount) { this.clickCount = clickCount; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String shortCode;
        private String shortUrl;
        private String longUrl;
        private String customAlias;
        private String title;
        private Instant createdAt;
        private Instant expiresAt;
        private Boolean isEnabled;
        private Integer clickCount;

        Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder shortCode(String shortCode) { this.shortCode = shortCode; return this; }
        public Builder shortUrl(String shortUrl) { this.shortUrl = shortUrl; return this; }
        public Builder longUrl(String longUrl) { this.longUrl = longUrl; return this; }
        public Builder customAlias(String customAlias) { this.customAlias = customAlias; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public Builder isEnabled(Boolean isEnabled) { this.isEnabled = isEnabled; return this; }
        public Builder clickCount(Integer clickCount) { this.clickCount = clickCount; return this; }

        public ShortUrlResponse build() {
            return new ShortUrlResponse(id, shortCode, shortUrl, longUrl, customAlias, title, createdAt, expiresAt, isEnabled, clickCount);
        }
    }
}
