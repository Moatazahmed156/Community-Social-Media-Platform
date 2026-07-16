import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'hv-create-community-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-community-modal.component.html',
  styleUrl: './create-community-modal.component.scss',
})
export class CreateCommunityModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Group>();

  private fb = inject(FormBuilder);
  private groupService = inject(GroupService);

  submitting = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.groupService.create(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        this.submitting = false;
        this.form.reset();
        this.created.emit(res.group);
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
