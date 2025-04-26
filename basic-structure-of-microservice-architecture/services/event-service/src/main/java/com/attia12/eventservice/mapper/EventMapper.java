package com.attia12.eventservice.mapper;

import com.attia12.eventservice.file.FileUtils;
import com.attia12.eventservice.model.Event;
import com.attia12.eventservice.request.EventRequest;
import com.attia12.eventservice.response.EventResponse;
import com.attia12.eventservice.response.RatingResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class EventMapper {
    public Event toEvent(EventRequest request) {
        return Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .date(request.getDate())
                .location(request.getLocation())
                .build();
    }

    public EventResponse toEventResponse(Event event) {
        List<RatingResponse> ratingResponses = event.getRatings().stream()
                .map(r -> RatingResponse.builder()
                        .userId(r.getUserId())
                        .value(r.getValue())
                        .build())
                .toList();

        double average = ratingResponses.isEmpty() ? 0 :
                ratingResponses.stream().mapToInt(RatingResponse::getValue).average().orElse(0);

        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .cover(FileUtils.readFileFromLocation(event.getEventCover()))
                .participantUserIds(event.getParticipantUserIds())
                .ratings(ratingResponses)
                .averageRating(average)
                .build();
    }
}
