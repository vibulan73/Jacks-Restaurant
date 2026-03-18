package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.MenuCategoryDTO;
import com.jacksnorwood.jacks_backend.dto.MenuItemDTO;
import com.jacksnorwood.jacks_backend.entity.MenuCategory;
import com.jacksnorwood.jacks_backend.entity.MenuItem;
import com.jacksnorwood.jacks_backend.repository.MenuCategoryRepository;
import com.jacksnorwood.jacks_backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    public List<MenuCategoryDTO> getAllCategories() {
        return menuCategoryRepository.findAllByOrderByDisplayOrderAsc()
                .stream().map(this::toCategoryDTO).collect(Collectors.toList());
    }

    public List<MenuItemDTO> getAllItems() {
        return menuItemRepository.findByIsActiveTrue()
                .stream().map(this::toItemDTO).collect(Collectors.toList());
    }

    public List<MenuItemDTO> getPopularItems() {
        return menuItemRepository.findByIsPopularTrueAndIsActiveTrue()
                .stream().map(this::toItemDTO).collect(Collectors.toList());
    }

    public List<MenuItemDTO> getItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryIdAndIsActiveTrue(categoryId)
                .stream().map(this::toItemDTO).collect(Collectors.toList());
    }

    public MenuItemDTO createItem(MenuItemDTO dto) {
        MenuCategory category = menuCategoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        MenuItem item = MenuItem.builder()
                .name(dto.getName()).description(dto.getDescription())
                .price(dto.getPrice()).imageUrl(dto.getImageUrl())
                .subcategory(dto.getSubcategory())
                .category(category)
                .isPopular(dto.getIsPopular() != null ? dto.getIsPopular() : false)
                .isSpicy(dto.getIsSpicy() != null ? dto.getIsSpicy() : false)
                .isVegan(dto.getIsVegan() != null ? dto.getIsVegan() : false)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return toItemDTO(menuItemRepository.save(item));
    }

    public MenuItemDTO updateItem(Long id, MenuItemDTO dto) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (dto.getCategoryId() != null) {
            MenuCategory cat = menuCategoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setCategory(cat);
        }
        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getDescription() != null) item.setDescription(dto.getDescription());
        if (dto.getPrice() != null) item.setPrice(dto.getPrice());
        if (dto.getImageUrl() != null) item.setImageUrl(dto.getImageUrl());
        if (dto.getSubcategory() != null) item.setSubcategory(dto.getSubcategory());
        if (dto.getIsPopular() != null) item.setIsPopular(dto.getIsPopular());
        if (dto.getIsSpicy() != null) item.setIsSpicy(dto.getIsSpicy());
        if (dto.getIsVegan() != null) item.setIsVegan(dto.getIsVegan());
        if (dto.getIsActive() != null) item.setIsActive(dto.getIsActive());
        return toItemDTO(menuItemRepository.save(item));
    }

    public void deleteItem(Long id) { menuItemRepository.deleteById(id); }

    public MenuCategoryDTO createCategory(MenuCategoryDTO dto) {
        MenuCategory cat = MenuCategory.builder()
                .name(dto.getName()).description(dto.getDescription())
                .displayOrder(dto.getDisplayOrder()).build();
        return toCategoryDTO(menuCategoryRepository.save(cat));
    }

    public MenuCategoryDTO updateCategory(Long id, MenuCategoryDTO dto) {
        MenuCategory cat = menuCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (dto.getName() != null) cat.setName(dto.getName());
        if (dto.getDescription() != null) cat.setDescription(dto.getDescription());
        if (dto.getDisplayOrder() != null) cat.setDisplayOrder(dto.getDisplayOrder());
        return toCategoryDTO(menuCategoryRepository.save(cat));
    }

    public void deleteCategory(Long id) { menuCategoryRepository.deleteById(id); }

    public MenuItemDTO toItemDTO(MenuItem item) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(item.getId()); dto.setName(item.getName());
        dto.setDescription(item.getDescription()); dto.setPrice(item.getPrice());
        dto.setImageUrl(item.getImageUrl()); dto.setSubcategory(item.getSubcategory());
        dto.setIsPopular(item.getIsPopular());
        dto.setIsSpicy(item.getIsSpicy()); dto.setIsVegan(item.getIsVegan());
        dto.setIsActive(item.getIsActive());
        if (item.getCategory() != null) {
            dto.setCategoryId(item.getCategory().getId());
            dto.setCategoryName(item.getCategory().getName());
        }
        return dto;
    }

    public MenuCategoryDTO toCategoryDTO(MenuCategory cat) {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setId(cat.getId()); dto.setName(cat.getName());
        dto.setDescription(cat.getDescription()); dto.setDisplayOrder(cat.getDisplayOrder());
        if (cat.getItems() != null) {
            dto.setItems(cat.getItems().stream()
                    .filter(i -> Boolean.TRUE.equals(i.getIsActive()))
                    .map(this::toItemDTO).collect(Collectors.toList()));
        }
        return dto;
    }
}
