import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {EventService} from '../../../services/event.service';
import {KeycloakService} from '../../../utils/keycloak/keycloak.service';
import {RatingModule} from '@syncfusion/ej2-angular-inputs';




@Component({
  selector: 'app-card-event',
  imports: [
    DatePipe,
    NgIf,
    NgClass,
    RatingModule



  ],
  templateUrl: './card-event.component.html',
  standalone: true,
  styleUrl: './card-event.component.css'
})
export class CardEventComponent {
  @Input() event!: any;
  @Output() eventUpdated = new EventEmitter<any>();

  constructor(
    private eventService: EventService,
    private keycloakService: KeycloakService
  ) {}
  joinEvent(eventId: string) {
    const userId = this.keycloakService.userId;
    this.eventService.participate(eventId, userId).subscribe({
      next: (response) => {

        if (!this.event.participantUserIds) {
          this.event.participantUserIds = [];
        }
        this.event.participantUserIds.push(userId);


        this.eventUpdated.emit(this.event);
      },
      error: (err) => {
        console.error('Error during participation:', err);
      }
    });

  }

  isJoined() {
    const userId = this.keycloakService.userId;
    return this.event.participantUserIds?.includes(userId);
  }




  onRateChange(event: any) {
    console.log('User selected rating:', event.value);
    const newRating =event.value;
    const userId = this.keycloakService.userId;
    this.eventService.rateEvent(this.event.id, userId, newRating).subscribe({
      next: () => {


      },
      error: err => {
        console.error('Rating failed:', err);
        if (err.status === 400 && err.error) {
          alert('You have already rated this event.');
        } else {
          console.error('Rating failed:', err);
          alert('Something went wrong while rating the event.');
        }

      }
    });
  }
}
