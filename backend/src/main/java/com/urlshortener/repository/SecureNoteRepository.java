package com.urlshortener.repository;

import com.urlshortener.entity.SecureNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface SecureNoteRepository extends JpaRepository<SecureNote, Long> {

    /** Find a note by its SHA-256 hash — the sole lookup key. */
    Optional<SecureNote> findByNoteHash(String noteHash);

    /** Scheduled cleanup: hard-delete all notes whose expiry has passed. */
    @Modifying
    @Query("DELETE FROM SecureNote s WHERE s.expiresAt < :now")
    int deleteByExpiresAtBefore(@Param("now") Instant now);
}
