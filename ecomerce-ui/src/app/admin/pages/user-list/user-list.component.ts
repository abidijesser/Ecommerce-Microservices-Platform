import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {UserService} from '../../../services/user.service';
declare var bootstrap: any;



@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.component.html',
  standalone: true,
  styleUrl: './user-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  users = signal<any[]>([]);
  loading = signal(true);
  selectedUserId = signal<string | null>(null);

  constructor(private userService: UserService) {

  }



  openDeleteModal(id: string) {
    this.selectedUserId.set(id);
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')!);
    modal.show();
  }

  confirmDelete() {
    const id = this.selectedUserId();
    if (!id) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        // Update local list
        const updatedUsers = this.users().filter(user => user.id !== id);
        this.users.set(updatedUsers);

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
    this.userService.getAllUsers().subscribe({
      next: (res: any[]) => {
        this.users.set(res);
        this.loading.set(false);
        console.log(this.users())
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });

  }


}
