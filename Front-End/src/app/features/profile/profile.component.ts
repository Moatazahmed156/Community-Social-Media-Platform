import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { GroupService } from '../../core/services/group.service';
import { ToastService } from '../../core/services/toast.service';
import { Group, GroupRole } from '../../core/models/group.model';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { CommunityCardComponent } from '../../shared/components/community-card/community-card.component';
import { FileUrlPipe } from '../../shared/pipes/file-url.pipe';

@Component({
  selector: 'hv-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AvatarComponent, CommunityCardComponent, FileUrlPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private userService = inject(UserService);
  private groupService = inject(GroupService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  editing = false;
  saving = false;
  myGroups: (Group & { myRole: GroupRole })[] = [];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    bio: [''],
  });

  ngOnInit(): void {
    const user = this.auth.currentUser();
    this.form.patchValue({
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username,
      bio: user?.bio,
    });

    this.groupService.getMyGroups().subscribe({
      next: (res) => (this.myGroups = res.groups as any),
      error: () => {},
    });
  }

  startEdit(): void {
    this.editing = true;
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.userService.updateProfile(this.form.getRawValue() as any).subscribe({
      next: (res) => {
        this.auth.updateLocalUser(res.user);
        this.editing = false;
        this.saving = false;
        this.toast.show('Profile updated.', 'success');
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  uploadAvatar(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.userService.uploadProfilePicture(file).subscribe({
      next: (res) => {
        this.auth.updateLocalUser(res.user);
        this.toast.show('Profile picture updated.', 'success');
      },
      error: () => {},
    });
  }

  uploadCover(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.userService.uploadCoverPicture(file).subscribe({
      next: (res) => {
        this.auth.updateLocalUser(res.user);
        this.toast.show('Cover photo updated.', 'success');
      },
      error: () => {},
    });
  }
}
