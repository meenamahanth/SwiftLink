package com.urlshortener.repository;

import com.urlshortener.entity.ShortUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    Optional<ShortUrl> findByShortCode(String shortCode);
    Optional<ShortUrl> findByCustomAlias(String customAlias);
    
    @Query("SELECT s FROM ShortUrl s WHERE s.shortCode = :code OR s.customAlias = :code")
    Optional<ShortUrl> findByShortCodeOrCustomAlias(@Param("code") String code);

    List<ShortUrl> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(s.clickCount), 0) FROM ShortUrl s WHERE s.user.id = :userId")
    long sumClickCountByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(s) FROM ShortUrl s WHERE s.user.id = :userId AND s.isEnabled = true AND (s.expiresAt IS NULL OR s.expiresAt > CURRENT_TIMESTAMP)")
    long countActiveUrlsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(s) FROM ShortUrl s WHERE s.user.id = :userId AND (s.isEnabled = false OR (s.expiresAt IS NOT NULL AND s.expiresAt <= CURRENT_TIMESTAMP))")
    long countInactiveUrlsByUserId(@Param("userId") Long userId);

    List<ShortUrl> findTop5ByUserIdOrderByClickCountDesc(Long userId);
}
