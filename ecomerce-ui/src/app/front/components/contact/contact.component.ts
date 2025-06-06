import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReclamationService} from '../../../services/reclamation.service';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact.component.html',
  standalone: true,
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  reclamationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService
  ) {
    this.reclamationForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
    });
  }

  submitReclamation() {
    if (this.reclamationForm.valid) {
      this.reclamationService
        .createReclamation(this.reclamationForm.value)
        .subscribe({
          next: (res) => {
            alert('Reclamation submitted successfully!');
            this.reclamationForm.reset();
          },
          error: (err) => {
            console.error('Error:', err);
            alert('Failed to submit reclamation.');
          },
        });
    }
    else {
      alert("Please fill in all the required fields.");
    }
  }

}
