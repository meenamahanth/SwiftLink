package com.urlshortener.service;

import com.urlshortener.entity.ClickAnalytics;
import com.urlshortener.entity.ShortUrl;
import com.urlshortener.entity.User;
import com.urlshortener.dto.*;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.ClickAnalyticsRepository;
import com.urlshortener.repository.ShortUrlRepository;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private ClickAnalyticsRepository clickAnalyticsRepository;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional
    public void recordClick(ShortUrl shortUrl, String userAgent, String ipAddress, String referrer) {
        String browser = parseBrowser(userAgent);
        String os = parseOS(userAgent);
        String deviceType = parseDeviceType(userAgent);

        // Normalize referrer
        String cleanedReferrer = (referrer == null || referrer.trim().isEmpty()) ? "Direct" : referrer.trim();

        ClickAnalytics click = ClickAnalytics.builder()
                .shortUrl(shortUrl)
                .browser(browser)
                .operatingSystem(os)
                .deviceType(deviceType)
                .ipAddress(ipAddress)
                .referrer(cleanedReferrer)
                .build();

        clickAnalyticsRepository.save(click);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        long totalLinks = shortUrlRepository.countByUserId(user.getId());
        long totalClicks = shortUrlRepository.sumClickCountByUserId(user.getId());
        long activeLinks = shortUrlRepository.countActiveUrlsByUserId(user.getId());
        long expiredLinks = shortUrlRepository.countInactiveUrlsByUserId(user.getId());

        return DashboardStatsResponse.builder()
                .totalLinks(totalLinks)
                .totalClicks(totalClicks)
                .activeLinks(activeLinks)
                .expiredLinks(expiredLinks)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ClickCountProjection> getClicksPerDayForUser(String username, int daysLimit) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Instant since = Instant.now().minus(Duration.ofDays(daysLimit));
        return clickAnalyticsRepository.getClicksPerDayForUser(user.getId(), since);
    }

    @Transactional(readOnly = true)
    public List<ShortUrlResponse> getTopPerformingUrls(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<ShortUrl> topUrls = shortUrlRepository.findTop5ByUserIdOrderByClickCountDesc(user.getId());
        return topUrls.stream().map(url -> ShortUrlResponse.builder()
                .id(url.getId())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/r/" + url.getShortCode())
                .longUrl(url.getLongUrl())
                .customAlias(url.getCustomAlias())
                .title(url.getTitle())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .isEnabled(url.getIsEnabled())
                .clickCount(url.getClickCount())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getUrlAnalytics(Long urlId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        ShortUrl shortUrl = shortUrlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found with ID: " + urlId));

        if (!shortUrl.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not own this short URL");
        }

        // Clicks over the last 30 days
        Instant since = Instant.now().minus(Duration.ofDays(30));
        List<ClickCountProjection> clicksPerDay = clickAnalyticsRepository.getClicksPerDayForUrl(urlId, since);

        // Group counts
        List<GroupCountProjection> browsers = clickAnalyticsRepository.getBrowserDistributionForUrl(urlId);
        List<GroupCountProjection> operatingSystems = clickAnalyticsRepository.getOsDistributionForUrl(urlId);
        List<GroupCountProjection> devices = clickAnalyticsRepository.getDeviceDistributionForUrl(urlId);

        // Recent clicks (limited to 30)
        List<ClickAnalytics> recentClicksRaw = clickAnalyticsRepository.findTop30ByShortUrlIdOrderByClickedAtDesc(urlId);
        List<ClickDetailResponse> recentClicks = recentClicksRaw.stream()
                .map(c -> ClickDetailResponse.builder()
                        .clickedAt(c.getClickedAt())
                        .referrer(c.getReferrer())
                        .browser(c.getBrowser())
                        .operatingSystem(c.getOperatingSystem())
                        .deviceType(c.getDeviceType())
                        .ipAddress(c.getIpAddress())
                        .build())
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .id(shortUrl.getId())
                .title(shortUrl.getTitle())
                .shortCode(shortUrl.getShortCode())
                .shortUrl(baseUrl + "/r/" + shortUrl.getShortCode())
                .longUrl(shortUrl.getLongUrl())
                .clickCount(shortUrl.getClickCount())
                .clicksPerDay(clicksPerDay)
                .browsers(browsers)
                .operatingSystems(operatingSystems)
                .devices(devices)
                .recentClicks(recentClicks)
                .build();
    }

    // Helper functions for lightweight User-Agent parsing
    private String parseBrowser(String ua) {
        if (ua == null || ua.isEmpty()) return "Direct/Other";
        String lower = ua.toLowerCase();
        if (lower.contains("edg/")) return "Edge";
        if (lower.contains("opr/") || lower.contains("opera")) return "Opera";
        if (lower.contains("chrome/") || lower.contains("crios/")) return "Chrome";
        if (lower.contains("firefox/") || lower.contains("fxios/")) return "Firefox";
        if (lower.contains("safari/") && !lower.contains("chrome") && !lower.contains("chromium")) return "Safari";
        if (lower.contains("msie") || lower.contains("trident/")) return "Internet Explorer";
        return "Other";
    }

    private String parseOS(String ua) {
        if (ua == null || ua.isEmpty()) return "Unknown";
        String lower = ua.toLowerCase();
        if (lower.contains("windows")) return "Windows";
        if (lower.contains("macintosh") || lower.contains("mac os x")) {
            if (lower.contains("iphone") || lower.contains("ipad")) return "iOS";
            return "macOS";
        }
        if (lower.contains("iphone") || lower.contains("ipad") || lower.contains("ipod")) return "iOS";
        if (lower.contains("android")) return "Android";
        if (lower.contains("linux")) return "Linux";
        return "Other";
    }

    private String parseDeviceType(String ua) {
        if (ua == null || ua.isEmpty()) return "Desktop";
        String lower = ua.toLowerCase();
        if (lower.contains("ipad") || (lower.contains("macintosh") && lower.contains("playbook")) || 
            (lower.contains("android") && !lower.contains("mobile"))) return "Tablet";
        if (lower.contains("mobile") || lower.contains("iphone") || lower.contains("ipod") || lower.contains("android")) return "Mobile";
        return "Desktop";
    }
}
