package com.urlshortener.controller;

import com.urlshortener.repository.ShortUrlRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final ShortUrlRepository shortUrlRepository;

    public HealthController(ShortUrlRepository shortUrlRepository) {
        this.shortUrlRepository = shortUrlRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> appHealth() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "backend"));
    }

    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> dbHealth() {
        long totalUrls = shortUrlRepository.count();
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "database", "UP",
                "shortUrlCount", totalUrls
        ));
    }
}