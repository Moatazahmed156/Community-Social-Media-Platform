import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { GroupService } from '../../core/services/group.service';
import { PostService } from '../../core/services/post.service';
import { Group, GroupRole } from '../../core/models/group.model';
import { Post } from '../../core/models/post.model';
import { CommunityCardComponent } from '../../shared/components/community-card/community-card.component';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { CreateCommunityModalComponent } from '../communities/create-modal/create-community-modal.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'hv-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CommunityCardComponent, PostCardComponent, CreateCommunityModalComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private groupService = inject(GroupService);
  private postService = inject(PostService);
  private toast = inject(ToastService);
  
  myGroups: (Group & { myRole: GroupRole })[] = [];
  feed: (Post & { groupName?: string })[] = [];
  loading = true;
  showCreateModal = false;


  ngOnInit(): void {
    this.groupService.getMyGroups().subscribe({
      next: (res) => {
        this.myGroups = res.groups as any;
        this.loadFeed();
      },
      error: () => (this.loading = false),
    });
  }

  private loadFeed(): void {
    const topGroups = this.myGroups.slice(0, 6);

    if (topGroups.length === 0) {
      this.loading = false;
      return;
    }

    const requests = topGroups.map((g) =>
      this.postService.list(g._id, 'approved', 1, 5).pipe(
        map((res) => res.posts.map((p) => ({ ...p, groupName: g.name }))),
        catchError(() => of([]))
      )
    );

    forkJoin(requests).subscribe((results) => {
      this.feed = results
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.loading = false;
    });
  }

  groupRole(post: Post): GroupRole | null {
    const group = this.myGroups.find((g) => g._id === post.groupId);
    return group?.myRole ?? null;
  }

  onPostChanged(): void {
    // Feed items are self-managing via post-card; nothing to refetch for now.
  }

  onPostDeleted(postId: string): void {
    this.feed = this.feed.filter((p) => p._id !== postId);
  }
  onCreated(group: Group): void {
    this.showCreateModal = false;
    this.toast.show('Community created!', 'success');
    this.myGroups = [{ ...group, myRole: 'owner' }, ...this.myGroups];
  }
}
