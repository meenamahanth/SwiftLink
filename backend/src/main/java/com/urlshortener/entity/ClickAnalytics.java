package com.urlshortener.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "click_analytics")
public class ClickAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_url_id", nullable = false)
    private ShortUrl shortUrl;

    @Column(name = "clicked_at", nullable = false, updatable = false)
    private Instant clickedAt;

    @Column(length = 255)
    private String referrer;

    @Column(length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    public ClickAnalytics() {}

    public ClickAnalytics(Long id, ShortUrl shortUrl, Instant clickedAt, String referrer, String browser, String operatingSystem, String deviceType, String ipAddress) {
        this.id = id;
        this.shortUrl = shortUrl;
        this.clickedAt = clickedAt;
        this.referrer = referrer;
        this.browser = browser;
        this.operatingSystem = operatingSystem;
        this.deviceType = deviceType;
        this.ipAddress = ipAddress;
    }

    @PrePersist
    protected void onCreate() {
        clickedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ShortUrl getShortUrl() { return shortUrl; }
    public void setShortUrl(ShortUrl shortUrl) { this.shortUrl = shortUrl; }
    public Instant getClickedAt() { return clickedAt; }
    public void setClickedAt(Instant clickedAt) { this.clickedAt = clickedAt; }
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }
    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private ShortUrl shortUrl;
        private Instant clickedAt;
        private String referrer;
        private String browser;
        private String operatingSystem;
        private String deviceType;
        private String ipAddress;

        Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder shortUrl(ShortUrl shortUrl) { this.shortUrl = shortUrl; return this; }
        public Builder clickedAt(Instant clickedAt) { this.clickedAt = clickedAt; return this; }
        public Builder referrer(String referrer) { this.referrer = referrer; return this; }
        public Builder browser(String browser) { this.browser = browser; return this; }
        public Builder operatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; return this; }
        public Builder deviceType(String deviceType) { this.deviceType = deviceType; return this; }
        public Builder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }

        public ClickAnalytics build() {
            return new ClickAnalytics(id, shortUrl, clickedAt, referrer, browser, operatingSystem, deviceType, ipAddress);
        }
    }
}
