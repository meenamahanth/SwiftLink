package com.urlshortener.dto;

public class DashboardStatsResponse {
    private Long totalLinks;
    private Long totalClicks;
    private Long activeLinks;
    private Long expiredLinks;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(Long totalLinks, Long totalClicks, Long activeLinks, Long expiredLinks) {
        this.totalLinks = totalLinks;
        this.totalClicks = totalClicks;
        this.activeLinks = activeLinks;
        this.expiredLinks = expiredLinks;
    }

    public Long getTotalLinks() { return totalLinks; }
    public void setTotalLinks(Long totalLinks) { this.totalLinks = totalLinks; }
    public Long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(Long totalClicks) { this.totalClicks = totalClicks; }
    public Long getActiveLinks() { return activeLinks; }
    public void setActiveLinks(Long activeLinks) { this.activeLinks = activeLinks; }
    public Long getExpiredLinks() { return expiredLinks; }
    public void setExpiredLinks(Long expiredLinks) { this.expiredLinks = expiredLinks; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long totalLinks;
        private Long totalClicks;
        private Long activeLinks;
        private Long expiredLinks;

        Builder() {}

        public Builder totalLinks(Long totalLinks) { this.totalLinks = totalLinks; return this; }
        public Builder totalClicks(Long totalClicks) { this.totalClicks = totalClicks; return this; }
        public Builder activeLinks(Long activeLinks) { this.activeLinks = activeLinks; return this; }
        public Builder expiredLinks(Long expiredLinks) { this.expiredLinks = expiredLinks; return this; }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalLinks, totalClicks, activeLinks, expiredLinks);
        }
    }
}
