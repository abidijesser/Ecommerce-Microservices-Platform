import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {forkJoin, of, switchMap} from 'rxjs';
import {EventService} from '../../../services/event.service';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
declare var bootstrap: any;
@Component({
  selector: 'app-event-list',
  imports: [
    DatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit{
  events = signal<any[]>([]);
  loading = signal(true);
  selectedEventId = signal<string | null>(null);
  isEditing = signal(false);
  editingEventId: string | null = null;
  newEvent: any = {
    name: '',
    description: '',
    date: '',
    location: '',
    cover: null,
    coverPreview: null
  };




  constructor(private eventService: EventService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.getAllEvents();

  }

  openAddModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
  }

  openDeleteModal(id: string) {
    this.selectedEventId.set(id);
    const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    modal.show();
  }

  confirmDelete() {
    const id = this.selectedEventId();
    if (!id) return;

    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.events.set(this.events().filter(p => p.id !== id));
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
        modal.hide();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
      }
    });
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newEvent.cover = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.newEvent.coverPreview = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  submitAddProduct() {
    const eventPayload = {
      name: this.newEvent.name,
      description: this.newEvent.description,
      date: this.newEvent.date,
      location: this.newEvent.location,

    };

    const isEdit = this.isEditing();
    const eventId = this.editingEventId;

    const action$ = isEdit
      ? this.eventService.updateEvent(eventId!, eventPayload)
      : this.eventService.createEvent(eventPayload);

    action$.pipe(
      switchMap((res: any) => {
        const id = isEdit ? eventId! : res;
        const tasks = [];

        if (this.newEvent.cover) {
          tasks.push(this.eventService.uploadCover(id, this.newEvent.cover));
        }

        return tasks.length > 0 ? forkJoin(tasks).pipe(switchMap(() => of(id))) : of(id);
      })
    ).subscribe({
      next: (id) => {

        const eventData = {
          id,
          name: this.newEvent.name,
          description: this.newEvent.description,
         date: this.newEvent.date,
          location: this.newEvent.location,

          cover: this.newEvent.coverPreview
        };

        if (isEdit) {
          this.events.update((prev) =>
            prev.map(p => p.id === id ? eventData : p)
          );
        } else {
          this.events.update(prev => [...prev, eventData]);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal?.hide();
        this.resetAddForm();
      },
      error: (err) => {
        console.error('Failed to save product:', err);
      }
    });
  }

  resetAddForm() {
    this.newEvent = {
      name: '',
      description: '',
     date: new Date(),
      location: '',

      cover: null,
      coverPreview: null
    };
    this.isEditing.set(false);
    this.editingEventId = null;
  }


  editProduct(product: any) {
    this.isEditing.set(true);
    this.editingEventId = product.id;

    this.newEvent = {
      name: product.name,
      description: product.description,
     date: product.date,
     location: product.location,
      cover: null,
      coverPreview: product.cover // show current image
    };

    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
  }


  private getAllEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (res) => {
        const updated = res.map((event:any )=> ({
          ...event,
          cover: event.cover
            ? 'data:image/jpeg;base64,' + event.cover
            : null
        }));
        this.events.set(updated);

        this.loading.set(false);
        console.log(this.events());
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

}
