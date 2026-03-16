package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.PromotionDTO;
import com.jacksnorwood.jacks_backend.entity.Promotion;
import com.jacksnorwood.jacks_backend.entity.PromotionType;
import com.jacksnorwood.jacks_backend.repository.PromotionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<PromotionDTO> getActivePromotions() {
        return promotionRepository.findByActiveTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PromotionDTO create(PromotionDTO dto) {
        PromotionType type = dto.getPromotionType() != null ? dto.getPromotionType() : PromotionType.SPECIAL;
        Promotion p = Promotion.builder()
                .title(dto.getTitle()).description(dto.getDescription())
                .imageUrl(dto.getImageUrl()).discount(dto.getDiscount())
                .startDate(dto.getStartDate()).endDate(dto.getEndDate())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .promotionType(type).build();
        return toDTO(promotionRepository.save(p));
    }

    public PromotionDTO update(Long id, PromotionDTO dto) {
        Promotion p = promotionRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (dto.getTitle() != null) p.setTitle(dto.getTitle());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) p.setImageUrl(dto.getImageUrl());
        if (dto.getDiscount() != null) p.setDiscount(dto.getDiscount());
        if (dto.getStartDate() != null) p.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) p.setEndDate(dto.getEndDate());
        if (dto.getActive() != null) p.setActive(dto.getActive());
        if (dto.getPromotionType() != null) p.setPromotionType(dto.getPromotionType());
        return toDTO(promotionRepository.save(p));
    }

    public void delete(Long id) { promotionRepository.deleteById(id); }

    private PromotionDTO toDTO(Promotion p) {
        PromotionDTO dto = new PromotionDTO();
        dto.setId(p.getId()); dto.setTitle(p.getTitle()); dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl()); dto.setDiscount(p.getDiscount());
        dto.setStartDate(p.getStartDate()); dto.setEndDate(p.getEndDate()); dto.setActive(p.getActive());
        dto.setPromotionType(p.getPromotionType());
        return dto;
    }
}
