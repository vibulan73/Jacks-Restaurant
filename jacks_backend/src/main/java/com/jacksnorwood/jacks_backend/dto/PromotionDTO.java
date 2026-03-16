package com.jacksnorwood.jacks_backend.dto;

import com.jacksnorwood.jacks_backend.entity.PromotionType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PromotionDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String discount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active;
    private PromotionType promotionType;
}
