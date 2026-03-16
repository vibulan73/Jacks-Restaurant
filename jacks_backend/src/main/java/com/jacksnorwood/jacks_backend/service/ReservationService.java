package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.ReservationDTO;
import com.jacksnorwood.jacks_backend.entity.Reservation;
import com.jacksnorwood.jacks_backend.entity.ReservationStatus;
import com.jacksnorwood.jacks_backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationDTO create(ReservationDTO dto) {
        Reservation r = Reservation.builder()
                .name(dto.getName()).email(dto.getEmail()).phone(dto.getPhone())
                .date(dto.getDate()).time(dto.getTime()).guests(dto.getGuests())
                .notes(dto.getNotes()).status(ReservationStatus.PENDING).build();
        return toDTO(reservationRepository.save(r));
    }

    public List<ReservationDTO> getAll() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ReservationDTO updateStatus(Long id, String status) {
        Reservation r = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        r.setStatus(ReservationStatus.valueOf(status.toUpperCase()));
        return toDTO(reservationRepository.save(r));
    }

    private ReservationDTO toDTO(Reservation r) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(r.getId()); dto.setName(r.getName()); dto.setEmail(r.getEmail());
        dto.setPhone(r.getPhone()); dto.setDate(r.getDate()); dto.setTime(r.getTime());
        dto.setGuests(r.getGuests()); dto.setNotes(r.getNotes());
        dto.setStatus(r.getStatus().name()); dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
