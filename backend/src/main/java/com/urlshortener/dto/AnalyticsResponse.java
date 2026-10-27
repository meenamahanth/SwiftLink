package com.urlshortener.dto;

import java.util.List;

public class AnalyticsResponse {
    private Long id;
    private String title;
    private String shortCode;
    private String shortUrl;
    private String longUrl;
    private Integer clickCount;
    private List<ClickCountProjection> clicksPerDay;
    private List<GroupCountProjection> browsers;
    private List<GroupCountProjection> operatingSystems;
    private List<GroupCountProjection> devices;
    private List<ClickDetailResponse> recentClicks;

    public AnalyticsResponse() {}

    public AnalyticsResponse(Long id, String title, String shortCode, String shortUrl, String longUrl, Integer clickCount, List<ClickCountProjection> clicksPerDay, List<GroupCountProjection> browsers, List<GroupCountProjection> operatingSystems, List<GroupCountProjection> devices, List<ClickDetailResponse> recentClicks) {
        this.id = id;
        this.title = title;
        this.shortCode = shortCode;
        this.shortUrl = shortUrl;
        this.longUrl = longUrl;
        this.clickCount = clickCount;
        this.clicksPerDay = clicksPerDay;
        this.browsers = browsers;
        this.operatingSystems = operatingSystems;
        this.devices = devices;
        this.recentClicks = recentClicks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }
    public String getShortUrl() { return shortUrl; }
    public void setShortUrl(String shortUrl) { this.shortUrl = shortUrl; }
    public String getLongUrl() { return longUrl; }
    public void setLongUrl(String longUrl) { this.longUrl = longUrl; }
    public Integer getClickCount() { return clickCount; }
    public void setClickCount(Integer clickCount) { this.clickCount = clickCount; }
    public List<ClickCountProjection> getClicksPerDay() { return clicksPerDay; }
    public void setClicksPerDay(List<ClickCountProjection> clicksPerDay) { this.clicksPerDay = clicksPerDay; }
    public List<GroupCountProjection> getBrowsers() { return browsers; }
    public void setBrowsers(List<GroupCountProjection> browsers) { this.browsers = browsers; }
    public List<GroupCountProjection> getOperatingSystems() { return operatingSystems; }
    public void setOperatingSystems(List<GroupCountProjection> operatingSystems) { this.operatingSystems = operatingSystems; }
    public List<GroupCountProjection> getDevices() { return devices; }
    public void setDevices(List<GroupCountProjection> devices) { this.devices = devices; }
    public List<ClickDetailResponse> getRecentClicks() { return recentClicks; }
    public void setRecentClicks(List<ClickDetailResponse> recentClicks) { this.recentClicks = recentClicks; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title;
        private String shortCode;
        private String shortUrl;
        private String longUrl;
        private Integer clickCount;
        private List<ClickCountProjection> clicksPerDay;
        private List<GroupCountProjection> browsers;
        private List<GroupCountProjection> operatingSystems;
        private List<GroupCountProjection> devices;
        private List<ClickDetailResponse> recentClicks;

        Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder shortCode(String shortCode) { this.shortCode = shortCode; return this; }
        public Builder shortUrl(String shortUrl) { this.shortUrl = shortUrl; return this; }
        public Builder longUrl(String longUrl) { this.longUrl = longUrl; return this; }
        public Builder clickCount(Integer clickCount) { this.clickCount = clickCount; return this; }
        public Builder clicksPerDay(List<ClickCountProjection> clicksPerDay) { this.clicksPerDay = clicksPerDay; return this; }
        public Builder browsers(List<GroupCountProjection> browsers) { this.browsers = browsers; return this; }
        public Builder operatingSystems(List<GroupCountProjection> operatingSystems) { this.operatingSystems = operatingSystems; return this; }
        public Builder devices(List<GroupCountProjection> devices) { this.devices = devices; return this; }
        public Builder recentClicks(List<ClickDetailResponse> recentClicks) { this.recentClicks = recentClicks; return this; }

        public AnalyticsResponse build() {
            return new AnalyticsResponse(id, title, shortCode, shortUrl, longUrl, clickCount, clicksPerDay, browsers, operatingSystems, devices, recentClicks);
        }
    }
}
