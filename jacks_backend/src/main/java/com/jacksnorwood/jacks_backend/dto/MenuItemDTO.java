package com.jacksnorwood.jacks_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItemDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Boolean isPopular;
    private Boolean isSpicy;
    private Boolean isVegan;
    private Boolean isActive;
}
