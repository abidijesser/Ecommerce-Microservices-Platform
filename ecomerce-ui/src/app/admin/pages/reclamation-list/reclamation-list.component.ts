import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';

import {Reclamation, ReclamationService} from '../../../services/reclamation.service';
declare var bootstrap: any;

@Component({
  selector: 'app-reclamation-list',
  imports: [],
  templateUrl: './reclamation-list.component.html',
  standalone: true,
  styleUrl: './reclamation-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ReclamationListComponent implements OnInit {
  reclamations = signal<Reclamation[]>([]);
  loading = signal(true);
  selectedReclamationId = signal<string | null>(null);

  constructor(private reclamationService: ReclamationService) {

  }



  openDeleteModal(id: string) {
    this.selectedReclamationId.set(id);
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')!);
    modal.show();
  }

  confirmDelete() {
    const id = this.selectedReclamationId();
    if (!id) return;

    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => {
        // Update local list
        const updatedReclamations = this.reclamations().filter(reclamation => reclamation._id !== id);
        this.reclamations.set(updatedReclamations);

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')!);
        modal?.hide();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        alert('Error deleting user.');
      }
    });
  }

  ngOnInit(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (res: any[]) => {
        this.reclamations.set(res);
        this.loading.set(false);
        console.log(this.reclamations())
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });

  }

}
