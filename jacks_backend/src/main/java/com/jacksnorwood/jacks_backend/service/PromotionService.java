package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.PromotionDTO;
import com.jacksnorwood.jacks_backend.entity.Promotion;
import com.jacksnorwood.jacks_backend.entity.PromotionType;
import com.jacksnorwood.jacks_backend.repository.PromotionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final NewsletterService newsletterService;

    public List<PromotionDTO> getActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        return promotionRepository.findByActiveTrue().stream()
                .filter(p -> {
                    if (p.getPromotionType() == PromotionType.DAILY) return true;
                    // SPECIAL: respect startDateTime / endDateTime window
                    boolean afterStart = p.getStartDateTime() == null || !now.isBefore(p.getStartDateTime());
                    boolean beforeEnd  = p.getEndDateTime()   == null || !now.isAfter(p.getEndDateTime());
                    return afterStart && beforeEnd;
                })
                .map(this::toDTO).collect(Collectors.toList());
    }

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PromotionDTO create(PromotionDTO dto) {
        PromotionType type = dto.getPromotionType() != null ? dto.getPromotionType() : PromotionType.SPECIAL;
        Promotion p = Promotion.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .startDateTime(dto.getStartDateTime())
                .endDateTime(dto.getEndDateTime())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .promotionType(type)
                .dayOfWeek(dto.getDayOfWeek())
                .build();
        PromotionDTO saved = toDTO(promotionRepository.save(p));
        try {
            String typeLabel = type == PromotionType.DAILY ? "Daily Special" : "Special";
            String body = saved.getDescription() != null && !saved.getDescription().isBlank()
                    ? saved.getDescription() : "Visit us to find out more!";
            newsletterService.notifySubscribers("New " + typeLabel + ": " + saved.getTitle(), body);
        } catch (Exception ignored) {}
        return saved;
    }

    public PromotionDTO update(Long id, PromotionDTO dto) {
        Promotion p = promotionRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (dto.getTitle() != null)         p.setTitle(dto.getTitle());
        if (dto.getDescription() != null)   p.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null)      p.setImageUrl(dto.getImageUrl());
        if (dto.getActive() != null)        p.setActive(dto.getActive());
        if (dto.getPromotionType() != null) p.setPromotionType(dto.getPromotionType());
        p.setDayOfWeek(dto.getDayOfWeek());
        p.setStartDateTime(dto.getStartDateTime());
        p.setEndDateTime(dto.getEndDateTime());
        return toDTO(promotionRepository.save(p));
    }

    public void delete(Long id) { promotionRepository.deleteById(id); }

    private PromotionDTO toDTO(Promotion p) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl());
        dto.setStartDateTime(p.getStartDateTime());
        dto.setEndDateTime(p.getEndDateTime());
        dto.setActive(p.getActive());
        dto.setPromotionType(p.getPromotionType());
        dto.setDayOfWeek(p.getDayOfWeek());
        return dto;
    }
}
