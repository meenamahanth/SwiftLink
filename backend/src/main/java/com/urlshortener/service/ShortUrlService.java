package com.urlshortener.service;

import com.google.zxing.WriterException;
import com.urlshortener.entity.ShortUrl;
import com.urlshortener.entity.User;
import com.urlshortener.dto.ShortUrlRequest;
import com.urlshortener.dto.ShortUrlResponse;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.ShortUrlRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.util.QrCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShortUrlService {

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    private static final String ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public ShortUrlResponse createShortUrl(ShortUrlRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String shortCode;
        String customAlias = null;

        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            customAlias = request.getCustomAlias().trim();
            // Validate alias isn't already taken as a code or custom alias
            if (shortUrlRepository.findByShortCodeOrCustomAlias(customAlias).isPresent()) {
                throw new BadRequestException("Custom alias '" + customAlias + "' is already in use");
            }
            shortCode = customAlias;
        } else {
            shortCode = generateUniqueShortCode();
        }

        ShortUrl shortUrl = ShortUrl.builder()
                .longUrl(request.getLongUrl())
                .shortCode(shortCode)
                .customAlias(customAlias)
                .title(request.getTitle() != null ? request.getTitle().trim() : null)
                .expiresAt(request.getExpiresAt())
                .user(user)
                .clickCount(0)
                .isEnabled(true)
                .build();

        ShortUrl savedUrl = shortUrlRepository.save(shortUrl);
        return mapToResponse(savedUrl);
    }

    @Transactional(readOnly = true)
    public List<ShortUrlResponse> getAllUrlsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<ShortUrl> urls = shortUrlRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return urls.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ShortUrlResponse getUrlDetails(Long id, String username) {
        ShortUrl shortUrl = getOwnedShortUrl(id, username);
        return mapToResponse(shortUrl);
    }

    @Transactional
    public ShortUrlResponse updateShortUrl(Long id, ShortUrlRequest request, String username) {
        ShortUrl shortUrl = getOwnedShortUrl(id, username);

        // Update long URL
        if (request.getLongUrl() != null && !request.getLongUrl().trim().isEmpty()) {
            shortUrl.setLongUrl(request.getLongUrl().trim());
        }

        // Update title
        shortUrl.setTitle(request.getTitle() != null ? request.getTitle().trim() : null);

        // Update expiration
        shortUrl.setExpiresAt(request.getExpiresAt());

        ShortUrl updatedUrl = shortUrlRepository.save(shortUrl);
        return mapToResponse(updatedUrl);
    }

    @Transactional
    public ShortUrlResponse toggleUrlStatus(Long id, boolean isEnabled, String username) {
        ShortUrl shortUrl = getOwnedShortUrl(id, username);
        shortUrl.setIsEnabled(isEnabled);
        ShortUrl updatedUrl = shortUrlRepository.save(shortUrl);
        return mapToResponse(updatedUrl);
    }

    @Transactional
    public void deleteShortUrl(Long id, String username) {
        ShortUrl shortUrl = getOwnedShortUrl(id, username);
        shortUrlRepository.delete(shortUrl);
    }

    @Transactional(readOnly = true)
    public byte[] generateQrCodeForUrl(Long id, String username) throws WriterException, IOException {
        ShortUrl shortUrl = getOwnedShortUrl(id, username);
        String fullShortUrl = baseUrl + "/r/" + shortUrl.getShortCode();
        return QrCodeGenerator.generateQrCode(fullShortUrl, 300, 300);
    }

    @Transactional(readOnly = true)
    public ShortUrl getUrlByCodeForRedirect(String code) {
        ShortUrl shortUrl = shortUrlRepository.findByShortCodeOrCustomAlias(code)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found for code: " + code));

        if (!shortUrl.getIsEnabled()) {
            throw new BadRequestException("This short URL has been disabled");
        }

        if (shortUrl.isExpired()) {
            throw new BadRequestException("This short URL has expired");
        }

        return shortUrl;
    }

    @Transactional
    public void incrementClickCount(ShortUrl shortUrl) {
        shortUrl.setClickCount(shortUrl.getClickCount() + 1);
        shortUrlRepository.save(shortUrl);
    }

    private String generateUniqueShortCode() {
        int codeLength = 6;
        for (int attempt = 0; attempt < 10; attempt++) {
            StringBuilder code = new StringBuilder(codeLength);
            for (int i = 0; i < codeLength; i++) {
                code.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
            }
            String possibleCode = code.toString();
            if (shortUrlRepository.findByShortCodeOrCustomAlias(possibleCode).isEmpty()) {
                return possibleCode;
            }
        }
        throw new BadRequestException("Failed to generate a unique short code after several attempts. Please try again.");
    }

    private ShortUrl getOwnedShortUrl(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        ShortUrl shortUrl = shortUrlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found with ID: " + id));

        if (!shortUrl.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not own this short URL");
        }

        return shortUrl;
    }

    private ShortUrlResponse mapToResponse(ShortUrl url) {
        return ShortUrlResponse.builder()
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
                .build();
    }
}
