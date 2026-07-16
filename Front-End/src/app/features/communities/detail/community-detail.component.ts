import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GroupService } from '../../../core/services/group.service';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Group, GroupMember, GroupRole } from '../../../core/models/group.model';
import { Post, PostStatus } from '../../../core/models/post.model';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FileUrlPipe } from '../../../shared/pipes/file-url.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

type Tab = 'posts' | 'pending' | 'members' | 'about';

@Component({
  selector: 'hv-community-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PostCardComponent,
    AvatarComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
    FileUrlPipe,
    TimeAgoPipe,
  ],
  templateUrl: './community-detail.component.html',
  styleUrl: './community-detail.component.scss',
})
export class CommunityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private postService = inject(PostService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  groupId = '';
  group: Group | null = null;
  memberCount = 0;
  myRole: GroupRole | null = null;
  loading = true;

  activeTab: Tab = 'posts';

  posts: Post[] = [];
  pendingPosts: Post[] = [];
  members: GroupMember[] = [];
  postsLoading = false;
  membersLoading = false;

  newPostContent = '';
  newPostFiles: File[] = [];
  posting = false;

  editingGroup = false;
  editForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });
  savingGroup = false;

  logoInput?: HTMLInputElement;
  coverInput?: HTMLInputElement;

  showDeleteConfirm = false;
  showLeaveConfirm = false;

  get isModerator(): boolean {
    return this.myRole === 'owner' || this.myRole === 'admin';
  }

  get isMember(): boolean {
    return !!this.myRole;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('groupId') ?? '';
      this.loadGroup();
    });
  }

  loadGroup(): void {
    this.loading = true;
    this.groupService.getById(this.groupId).subscribe({
      next: (res) => {
        this.group = res.group;
        this.memberCount = res.memberCount;
        this.myRole = res.myRole as GroupRole | null;
        this.loading = false;
        this.editForm.patchValue({ name: res.group.name, description: res.group.description ?? '' });
        if (this.isMember) this.loadPosts();
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/communities/explore']);
      },
    });
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
    if (tab === 'posts' && this.posts.length === 0) this.loadPosts();
    if (tab === 'pending' && this.pendingPosts.length === 0) this.loadPending();
    if (tab === 'members' && this.members.length === 0) this.loadMembers();
  }

  loadPosts(): void {
    this.postsLoading = true;
    this.postService.list(this.groupId, 'approved', 1, 50).subscribe({
      next: (res) => {
        this.posts = res.posts;
        this.postsLoading = false;
      },
      error: () => (this.postsLoading = false),
    });
  }

  loadPending(): void {
    this.postsLoading = true;

    if (this.isModerator) {
      // Moderators review the whole group's queue.
      this.postService.list(this.groupId, 'pending', 1, 50).subscribe({
        next: (res) => {
          this.pendingPosts = res.posts;
          this.postsLoading = false;
        },
        error: () => (this.postsLoading = false),
      });
      return;
    }

    // Regular members only ever get back their own pending/rejected posts,
    // so their submissions stay visible (and editable while pending)
    // instead of disappearing until a moderator acts on them.
    forkJoin({
      pending: this.postService.list(this.groupId, 'pending', 1, 50),
      rejected: this.postService.list(this.groupId, 'rejected', 1, 50),
    }).subscribe({
      next: ({ pending, rejected }) => {
        this.pendingPosts = [...pending.posts, ...rejected.posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.postsLoading = false;
      },
      error: () => (this.postsLoading = false),
    });
  }

  loadMembers(): void {
    this.membersLoading = true;
    this.groupService.listMembers(this.groupId).subscribe({
      next: (res) => {
        this.members = res.members;
        this.membersLoading = false;
      },
      error: () => (this.membersLoading = false),
    });
  }

  join(): void {
    this.groupService.join(this.groupId).subscribe({
      next: () => {
        this.myRole = 'member';
        this.memberCount++;
        this.toast.show('Joined the community!', 'success');
        this.loadPosts();
      },
      error: () => {},
    });
  }

  confirmLeave(): void {
    this.groupService.leave(this.groupId).subscribe({
      next: () => {
        this.showLeaveConfirm = false;
        this.myRole = null;
        this.memberCount = Math.max(0, this.memberCount - 1);
        this.toast.show('You left the community.', 'info');
      },
      error: () => {
        this.showLeaveConfirm = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.newPostFiles = Array.from(input.files).slice(0, 5);
  }

  submitPost(): void {
    if (!this.newPostContent.trim()) return;
    this.posting = true;
    this.postService.create(this.groupId, this.newPostContent.trim(), this.newPostFiles).subscribe({
      next: () => {
        this.posting = false;
        this.newPostContent = '';
        this.newPostFiles = [];
        this.toast.show('Post submitted for approval.', 'success');
        this.loadPending();
      },
      error: () => {
        this.posting = false;
      },
    });
  }

  onPostUpdatedInApproved(updated: Post): void {
    if (updated.status !== 'approved') {
      this.posts = this.posts.filter((p) => p._id !== updated._id);
    } else {
      this.posts = this.posts.map((p) => (p._id === updated._id ? updated : p));
    }
  }

  onPostDeletedFromApproved(id: string): void {
    this.posts = this.posts.filter((p) => p._id !== id);
  }

  onPendingPostUpdated(updated: Post): void {
    this.pendingPosts = this.pendingPosts.filter((p) => p._id !== updated._id);
    if (updated.status === 'approved') {
      this.posts = [updated, ...this.posts];
    }
  }

  onPendingPostDeleted(id: string): void {
    this.pendingPosts = this.pendingPosts.filter((p) => p._id !== id);
  }

  memberUser(member: GroupMember) {
    return typeof member.userId === 'object' ? member.userId : null;
  }

  changeMemberRole(member: GroupMember, role: 'admin' | 'member'): void {
    const userId = typeof member.userId === 'object' ? member.userId._id : member.userId;
    this.groupService.changeMemberRole(this.groupId, userId, role).subscribe({
      next: () => {
        member.role = role;
        this.toast.show('Member role updated.', 'success');
      },
      error: () => {},
    });
  }

  removeMember(member: GroupMember): void {
    const userId = typeof member.userId === 'object' ? member.userId._id : member.userId;
    if (!confirm('Remove this member from the community?')) return;
    this.groupService.removeMember(this.groupId, userId).subscribe({
      next: () => {
        this.members = this.members.filter((m) => m._id !== member._id);
        this.memberCount = Math.max(0, this.memberCount - 1);
        this.toast.show('Member removed.', 'success');
      },
      error: () => {},
    });
  }

  startEditGroup(): void {
    this.editingGroup = true;
  }

  saveGroup(): void {
    if (this.editForm.invalid) return;
    this.savingGroup = true;
    this.groupService.update(this.groupId, this.editForm.getRawValue() as any).subscribe({
      next: (res) => {
        this.group = res.group;
        this.editingGroup = false;
        this.savingGroup = false;
        this.toast.show('Community updated.', 'success');
      },
      error: () => {
        this.savingGroup = false;
      },
    });
  }

  uploadLogo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.group) return;
    this.groupService.uploadLogo(this.groupId, file).subscribe({
      next: (res) => {
        this.group = res.group;
        this.toast.show('Logo updated.', 'success');
      },
      error: () => {},
    });
  }

  uploadCover(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.group) return;
    this.groupService.uploadCover(this.groupId, file).subscribe({
      next: (res) => {
        this.group = res.group;
        this.toast.show('Cover image updated.', 'success');
      },
      error: () => {},
    });
  }

  deleteGroup(): void {
    this.groupService.delete(this.groupId).subscribe({
      next: () => {
        this.toast.show('Community deleted.', 'success');
        this.router.navigate(['/communities/mine']);
      },
      error: () => {
        this.showDeleteConfirm = false;
      },
    });
  }
}
