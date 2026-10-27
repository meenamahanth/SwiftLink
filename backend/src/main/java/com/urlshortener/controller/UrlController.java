package com.urlshortener.controller;

import com.urlshortener.dto.MessageResponse;
import com.urlshortener.dto.ShortUrlRequest;
import com.urlshortener.dto.ShortUrlResponse;
import com.urlshortener.service.ShortUrlService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    @Autowired
    private ShortUrlService shortUrlService;

    @PostMapping
    public ResponseEntity<ShortUrlResponse> createShortUrl(@Valid @RequestBody ShortUrlRequest request, Principal principal) {
        ShortUrlResponse response = shortUrlService.createShortUrl(request, principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ShortUrlResponse>> getAllUrls(Principal principal) {
        List<ShortUrlResponse> response = shortUrlService.getAllUrlsForUser(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShortUrlResponse> getUrlDetails(@PathVariable Long id, Principal principal) {
        ShortUrlResponse response = shortUrlService.getUrlDetails(id, principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShortUrlResponse> updateShortUrl(@PathVariable Long id, @Valid @RequestBody ShortUrlRequest request, Principal principal) {
        ShortUrlResponse response = shortUrlService.updateShortUrl(id, request, principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ShortUrlResponse> toggleUrlStatus(@PathVariable Long id, @RequestParam boolean enabled, Principal principal) {
        ShortUrlResponse response = shortUrlService.toggleUrlStatus(id, enabled, principal.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteShortUrl(@PathVariable Long id, Principal principal) {
        shortUrlService.deleteShortUrl(id, principal.getName());
        return ResponseEntity.ok(new MessageResponse("Short URL deleted successfully"));
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> downloadQrCode(@PathVariable Long id, Principal principal) throws Exception {
        byte[] qrBytes = shortUrlService.generateQrCodeForUrl(id, principal.getName());
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qrcode-" + id + ".png\"")
                .body(qrBytes);
    }
}
