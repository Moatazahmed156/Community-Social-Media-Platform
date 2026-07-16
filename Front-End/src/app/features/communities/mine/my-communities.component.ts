import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../core/services/group.service';
import { Group, GroupRole } from '../../../core/models/group.model';
import { CommunityCardComponent } from '../../../shared/components/community-card/community-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { RouterModule } from '@angular/router';
import { CreateCommunityModalComponent } from '../create-modal/create-community-modal.component';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'hv-my-communities',
  standalone: true,
  imports: [CommonModule, CommunityCardComponent, CreateCommunityModalComponent, EmptyStateComponent, RouterModule],
  templateUrl: './my-communities.component.html',
  styleUrl: './my-communities.component.scss',
})
export class MyCommunitiesComponent implements OnInit {
  private groupService = inject(GroupService);
  private toast = inject(ToastService);
  

  groups: (Group & { myRole: GroupRole })[] = [];
  loading = true;
  showCreateModal = false;


  ngOnInit(): void {
    this.groupService.getMyGroups().subscribe({
      next: (res) => {
        this.groups = res.groups as any;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  onCreated(group: Group): void {
      this.showCreateModal = false;
      this.toast.show('Community created!', 'success');
      this.groups = [{ ...group, myRole: 'owner' }, ...this.groups];
    }
}
