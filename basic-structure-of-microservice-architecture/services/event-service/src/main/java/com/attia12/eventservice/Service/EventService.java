package com.attia12.eventservice.Service;

import com.attia12.eventservice.file.FileStorageService;
import com.attia12.eventservice.mapper.EventMapper;
import com.attia12.eventservice.model.Event;
import com.attia12.eventservice.model.Rating;
import com.attia12.eventservice.repository.EventRepository;
import com.attia12.eventservice.request.EventRequest;
import com.attia12.eventservice.response.EventResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor

public class EventService {
    private final EventRepository repository;
    private final EventMapper mapper;
    private final FileStorageService fileStorageService;
    public String createEvent(EventRequest request) {
        var event = this.repository.save(mapper.toEvent(request));
        return event.getId();
    }

    public List<EventResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toEventResponse)
                .collect(Collectors.toList());
    }

    public EventResponse updateEvent(String eventId, EventRequest request) {
        Optional<Event> existingEventOpt = repository.findById(eventId);
        if (existingEventOpt.isEmpty()) {
            return null;
        }

        Event existingEvent = existingEventOpt.get();

        existingEvent.setName(request.getName());
        existingEvent.setDescription(request.getDescription());
        existingEvent.setDate(request.getDate());
        existingEvent.setLocation(request.getLocation());


        Event updatedEvent = repository.save(existingEvent);
        return mapper.toEventResponse(updatedEvent);
    }

    public boolean deleteEvent(String eventId) {
        if (!repository.existsById(eventId)) {
            return false;  
        }
        repository.deleteById(eventId);
        return true;
    }

    public boolean participateInEvent(String eventId, String userId) {
        Optional<Event> eventOpt = repository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return false;
        }

        Event event = eventOpt.get();

        if (event.getParticipantUserIds().contains(userId)) {
            return false;
        }


        event.getParticipantUserIds().add(userId);
        repository.save(event);
        return true;
    }

    public void uploadEventCoverPicture(MultipartFile file, String eventId) {
        Event event=repository.findById(eventId).orElseThrow(()-> new EntityNotFoundException("No book found with the ID :: "+eventId));

        var eventCover=fileStorageService.saveFile(file,event.getId());
       event.setEventCover(eventCover);
        repository.save(event);
    }

    public boolean addRatingToEvent(String eventId, Rating rating) {
        Event event = repository.findById(eventId).orElse(null);
        if (event == null) return false;

        boolean alreadyRated = event.getRatings() != null &&
                event.getRatings().stream().anyMatch(r -> r.getUserId().equals(rating.getUserId()));

        if (alreadyRated) return false;

        if (event.getRatings() == null) event.setRatings(new ArrayList<>());
        rating.setEvent(event);
        event.getRatings().add(rating);
        repository.save(event);
        return true;
    }
}
