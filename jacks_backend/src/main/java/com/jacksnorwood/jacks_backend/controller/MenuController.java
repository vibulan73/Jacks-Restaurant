package com.jacksnorwood.jacks_backend.controller;

import com.jacksnorwood.jacks_backend.dto.MenuCategoryDTO;
import com.jacksnorwood.jacks_backend.dto.MenuItemDTO;
import com.jacksnorwood.jacks_backend.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategoryDTO>> getCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> getAllItems() {
        return ResponseEntity.ok(menuService.getAllItems());
    }

    @GetMapping("/popular")
    public ResponseEntity<List<MenuItemDTO>> getPopular() {
        return ResponseEntity.ok(menuService.getPopularItems());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<MenuItemDTO>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(menuService.getItemsByCategory(categoryId));
    }

    @PostMapping
    public ResponseEntity<MenuItemDTO> create(@RequestBody MenuItemDTO dto) {
        return ResponseEntity.ok(menuService.createItem(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemDTO> update(@PathVariable Long id, @RequestBody MenuItemDTO dto) {
        return ResponseEntity.ok(menuService.updateItem(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/categories")
    public ResponseEntity<MenuCategoryDTO> createCategory(@RequestBody MenuCategoryDTO dto) {
        return ResponseEntity.ok(menuService.createCategory(dto));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<MenuCategoryDTO> updateCategory(@PathVariable Long id, @RequestBody MenuCategoryDTO dto) {
        return ResponseEntity.ok(menuService.updateCategory(id, dto));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        menuService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
