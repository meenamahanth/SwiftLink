package com.urlshortener.repository;

import com.urlshortener.entity.ClickAnalytics;
import com.urlshortener.dto.ClickCountProjection;
import com.urlshortener.dto.GroupCountProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ClickAnalyticsRepository extends JpaRepository<ClickAnalytics, Long> {

    List<ClickAnalytics> findTop30ByShortUrlIdOrderByClickedAtDesc(Long shortUrlId);

    // Click history over time for all URLs of a user
    @Query(value = "SELECT CAST(c.clicked_at AS DATE) as date, COUNT(c.id) as count " +
                   "FROM click_analytics c " +
                   "JOIN short_urls s ON c.short_url_id = s.id " +
                   "WHERE s.user_id = :userId AND c.clicked_at >= :since " +
                   "GROUP BY CAST(c.clicked_at AS DATE) " +
                   "ORDER BY date ASC", nativeQuery = true)
    List<ClickCountProjection> getClicksPerDayForUser(@Param("userId") Long userId, @Param("since") Instant since);

    // Click history over time for a single URL
    @Query(value = "SELECT CAST(c.clicked_at AS DATE) as date, COUNT(c.id) as count " +
                   "FROM click_analytics c " +
                   "WHERE c.short_url_id = :urlId AND c.clicked_at >= :since " +
                   "GROUP BY CAST(c.clicked_at AS DATE) " +
                   "ORDER BY date ASC", nativeQuery = true)
    List<ClickCountProjection> getClicksPerDayForUrl(@Param("urlId") Long urlId, @Param("since") Instant since);

    // Distribution queries for a User's cumulative urls
    @Query(value = "SELECT COALESCE(c.browser, 'Unknown') as name, COUNT(c.id) as value " +
                   "FROM click_analytics c " +
                   "JOIN short_urls s ON c.short_url_id = s.id " +
                   "WHERE s.user_id = :userId " +
                   "GROUP BY c.browser " +
                   "ORDER BY value DESC", nativeQuery = true)
    List<GroupCountProjection> getBrowserDistributionForUser(@Param("userId") Long userId);

    @Query(value = "SELECT COALESCE(c.operating_system, 'Unknown') as name, COUNT(c.id) as value " +
                   "FROM click_analytics c " +
                   "JOIN short_urls s ON c.short_url_id = s.id " +
                   "WHERE s.user_id = :userId " +
                   "GROUP BY c.operating_system " +
                   "ORDER BY value DESC", nativeQuery = true)
    List<GroupCountProjection> getOsDistributionForUser(@Param("userId") Long userId);

    @Query(value = "SELECT COALESCE(c.device_type, 'Unknown') as name, COUNT(c.id) as value " +
                   "FROM click_analytics c " +
                   "JOIN short_urls s ON c.short_url_id = s.id " +
                   "WHERE s.user_id = :userId " +
                   "GROUP BY c.device_type " +
                   "ORDER BY value DESC", nativeQuery = true)
    List<GroupCountProjection> getDeviceDistributionForUser(@Param("userId") Long userId);

    // Distribution queries for a specific short URL
    @Query(value = "SELECT COALESCE(c.browser, 'Unknown') as name, COUNT(c.id) as value " +
                   "FROM click_analytics c " +
                   "WHERE c.short_url_id = :urlId " +
                   "GROUP BY c.browser " +
                   "ORDER BY value DESC", nativeQuery = true)
    List<GroupCountProjection> getBrowserDistributionForUrl(@Param("urlId") Long urlId);

    @Query(value = "SELECT COALESCE(c.operating_system, 'Unknown') as name, COUNT(c.id) as value " +
                   "FROM click_analytics c " +
                   "WHERE c.short_url_id = :urlId " +
                   "GROUP BY c.operating_system " +
                   "ORDER BY value DESC", nativeQuery = true)
    List<GroupCountProjection> getOsDistributionForUrl(@Param("urlId") Long urlId);

    @Query(value = "SELECT COALESCE(c.device_type, 'Unknown') as name, COUNT(c.id) as value " +
                   "FROM click_analytics c " +
                   "WHERE c.short_url_id = :urlId " +
                   "GROUP BY c.device_type " +
                   "ORDER BY value DESC", nativeQuery = true)
    List<GroupCountProjection> getDeviceDistributionForUrl(@Param("urlId") Long urlId);
}
