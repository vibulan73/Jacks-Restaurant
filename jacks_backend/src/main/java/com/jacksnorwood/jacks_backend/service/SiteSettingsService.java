package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.entity.SiteSettings;
import com.jacksnorwood.jacks_backend.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteSettingsService {

    private final SiteSettingsRepository repo;

    public Map<String, String> getAll() {
        return repo.findAll().stream()
                .collect(Collectors.toMap(SiteSettings::getKey, s -> s.getValue() != null ? s.getValue() : ""));
    }

    public void update(String key, String value) {
        repo.save(new SiteSettings(key, value));
    }

    public void updateAll(Map<String, String> settings) {
        List<SiteSettings> entities = settings.entrySet().stream()
                .map(e -> new SiteSettings(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        repo.saveAll(entities);
    }
}
