package com.urlshortener.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "short_urls")
public class ShortUrl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "short_code", nullable = false, unique = true, length = 50)
    private String shortCode;

    @Column(name = "long_url", nullable = false, columnDefinition = "TEXT")
    private String longUrl;

    @Column(name = "custom_alias", unique = true, length = 50)
    private String customAlias;

    @Column(length = 255)
    private String title;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "is_enabled", nullable = false)
    private Boolean isEnabled = true;

    @Column(name = "click_count", nullable = false)
    private Integer clickCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public ShortUrl() {}

    public ShortUrl(Long id, String shortCode, String longUrl, String customAlias, String title, Instant createdAt, Instant expiresAt, Boolean isEnabled, Integer clickCount, User user) {
        this.id = id;
        this.shortCode = shortCode;
        this.longUrl = longUrl;
        this.customAlias = customAlias;
        this.title = title;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.isEnabled = isEnabled;
        this.clickCount = clickCount;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        if (isEnabled == null) {
            isEnabled = true;
        }
        if (clickCount == null) {
            clickCount = 0;
        }
    }

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(Instant.now());
    }

    public boolean isActive() {
        return Boolean.TRUE.equals(isEnabled) && !isExpired();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }
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
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String shortCode;
        private String longUrl;
        private String customAlias;
        private String title;
        private Instant createdAt;
        private Instant expiresAt;
        private Boolean isEnabled = true;
        private Integer clickCount = 0;
        private User user;

        Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder shortCode(String shortCode) { this.shortCode = shortCode; return this; }
        public Builder longUrl(String longUrl) { this.longUrl = longUrl; return this; }
        public Builder customAlias(String customAlias) { this.customAlias = customAlias; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public Builder isEnabled(Boolean isEnabled) { this.isEnabled = isEnabled; return this; }
        public Builder clickCount(Integer clickCount) { this.clickCount = clickCount; return this; }
        public Builder user(User user) { this.user = user; return this; }

        public ShortUrl build() {
            return new ShortUrl(id, shortCode, longUrl, customAlias, title, createdAt, expiresAt, isEnabled, clickCount, user);
        }
    }
}
