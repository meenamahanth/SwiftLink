package com.urlshortener.controller;

import com.urlshortener.entity.ShortUrl;
import com.urlshortener.service.ShortUrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/r")
public class RedirectController {

    @Autowired
    private ShortUrlService shortUrlService;

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirectUrl(@PathVariable String code) {
        ShortUrl shortUrl = shortUrlService.getUrlByCodeForRedirect(code);

        // Detailed analytics are paused until a bounded worker is added.

        // Increment total click count in ShortUrl entity
        shortUrlService.incrementClickCount(shortUrl);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(shortUrl.getLongUrl()))
                .build();
    }
}
