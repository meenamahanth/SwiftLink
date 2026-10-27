package com.urlshortener.service;

import com.urlshortener.repository.SecureNoteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class SecureNoteCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(SecureNoteCleanupService.class);

    @Autowired
    private SecureNoteRepository secureNoteRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanupExpiredNotes() {
        Instant now = Instant.now();
        int deleted = secureNoteRepository.deleteByExpiresAtBefore(now);
        if (deleted > 0) {
            logger.info("Deleted {} expired secure note(s)", deleted);
        }
    }
}
