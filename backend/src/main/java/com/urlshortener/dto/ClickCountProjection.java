package com.urlshortener.dto;

import java.time.LocalDate;

public interface ClickCountProjection {
    LocalDate getDate();
    Long getCount();
}
