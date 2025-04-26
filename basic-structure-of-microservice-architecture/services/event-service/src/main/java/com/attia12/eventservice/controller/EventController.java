package com.attia12.eventservice.controller;

import com.attia12.eventservice.Service.EventService;
import com.attia12.eventservice.model.Rating;
import com.attia12.eventservice.request.EventRequest;
import com.attia12.eventservice.response.EventResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService service;

    @PostMapping
    public ResponseEntity<String> createEvent(
            @RequestBody EventRequest request
    ) {
        return ResponseEntity.ok(service.createEvent(request));
    }
    @GetMapping
    public ResponseEntity<List<EventResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable String eventId,
            @RequestBody EventRequest request
    ) {
        EventResponse updatedEvent = service.updateEvent(eventId, request);
        if (updatedEvent == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedEvent);
    }


    @DeleteMapping("/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable String eventId) {
        boolean isDeleted = service.deleteEvent(eventId);
        if (!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Event deleted successfully.");
    }
    @PostMapping("/{eventId}/participate")
    public ResponseEntity<String> participateInEvent(@PathVariable String eventId, @RequestBody String userId) {
        boolean isParticipated = service.participateInEvent(eventId, userId);
        if (!isParticipated) {
            return ResponseEntity.badRequest().body("User already participating or event not found.");
        }
        return ResponseEntity.ok("User added to the event successfully.");
    }
    @PostMapping(value = "/cover/{event-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadBookCoverPicture(
            @PathVariable("event-id") String eventId,

            @RequestPart("file") MultipartFile file

    ) {
        service.uploadEventCoverPicture(file, eventId);
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/{eventId}/rate")
    public ResponseEntity<String> rateEvent(
            @PathVariable String eventId,
            @RequestBody Rating rating) {
        boolean added = service.addRatingToEvent(eventId, rating);
        if (!added) return ResponseEntity.badRequest().body("You already rated this event.");
        return ResponseEntity.ok("Rating submitted.");
    }
}
