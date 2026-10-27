package com.urlshortener.controller;

import com.urlshortener.dto.AnalyticsResponse;
import com.urlshortener.dto.ClickCountProjection;
import com.urlshortener.dto.DashboardStatsResponse;
import com.urlshortener.dto.ShortUrlResponse;
import com.urlshortener.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(Principal principal) {
        DashboardStatsResponse response = analyticsService.getDashboardStats(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/clicks-by-day")
    public ResponseEntity<List<ClickCountProjection>> getClicksPerDay(
            @RequestParam(value = "days", defaultValue = "7") int days, 
            Principal principal) {
        List<ClickCountProjection> response = analyticsService.getClicksPerDayForUser(principal.getName(), days);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-urls")
    public ResponseEntity<List<ShortUrlResponse>> getTopUrls(Principal principal) {
        List<ShortUrlResponse> response = analyticsService.getTopPerformingUrls(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/urls/{id}")
    public ResponseEntity<AnalyticsResponse> getUrlAnalytics(@PathVariable Long id, Principal principal) {
        AnalyticsResponse response = analyticsService.getUrlAnalytics(id, principal.getName());
        return ResponseEntity.ok(response);
    }
}
