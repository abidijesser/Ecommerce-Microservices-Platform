package com.attia12.eventservice.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class EventResponse {
    private String id;
    private String name;
    private String description;
    private LocalDateTime date;
    private String location;
    private Set<String> participantUserIds;
    private byte[] cover;
    private List<RatingResponse> ratings;

    private Double averageRating;
}
