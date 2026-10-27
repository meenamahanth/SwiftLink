package com.urlshortener.dto;

import java.time.Instant;

public class ClickDetailResponse {
    private Instant clickedAt;
    private String referrer;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private String ipAddress;

    public ClickDetailResponse() {}

    public ClickDetailResponse(Instant clickedAt, String referrer, String browser, String operatingSystem, String deviceType, String ipAddress) {
        this.clickedAt = clickedAt;
        this.referrer = referrer;
        this.browser = browser;
        this.operatingSystem = operatingSystem;
        this.deviceType = deviceType;
        this.ipAddress = ipAddress;
    }

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
        private Instant clickedAt;
        private String referrer;
        private String browser;
        private String operatingSystem;
        private String deviceType;
        private String ipAddress;

        Builder() {}

        public Builder clickedAt(Instant clickedAt) { this.clickedAt = clickedAt; return this; }
        public Builder referrer(String referrer) { this.referrer = referrer; return this; }
        public Builder browser(String browser) { this.browser = browser; return this; }
        public Builder operatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; return this; }
        public Builder deviceType(String deviceType) { this.deviceType = deviceType; return this; }
        public Builder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }

        public ClickDetailResponse build() {
            return new ClickDetailResponse(clickedAt, referrer, browser, operatingSystem, deviceType, ipAddress);
        }
    }
}
