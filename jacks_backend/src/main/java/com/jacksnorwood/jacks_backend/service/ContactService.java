package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.ContactMessageDTO;
import com.jacksnorwood.jacks_backend.entity.ContactMessage;
import com.jacksnorwood.jacks_backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageDTO create(ContactMessageDTO dto) {
        ContactMessage m = ContactMessage.builder()
                .name(dto.getName()).email(dto.getEmail()).phone(dto.getPhone())
                .message(dto.getMessage()).isRead(false).build();
        return toDTO(contactMessageRepository.save(m));
    }

    public List<ContactMessageDTO> getAll() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ContactMessageDTO markAsRead(Long id) {
        ContactMessage m = contactMessageRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        m.setIsRead(true);
        return toDTO(contactMessageRepository.save(m));
    }

    private ContactMessageDTO toDTO(ContactMessage m) {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setId(m.getId()); dto.setName(m.getName()); dto.setEmail(m.getEmail());
        dto.setPhone(m.getPhone()); dto.setMessage(m.getMessage());
        dto.setCreatedAt(m.getCreatedAt()); dto.setIsRead(m.getIsRead());
        return dto;
    }
}
