import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../core/services/group.service';
import { ToastService } from '../../../core/services/toast.service';
import { Group } from '../../../core/models/group.model';
import { CommunityCardComponent } from '../../../shared/components/community-card/community-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CreateCommunityModalComponent } from '../create-modal/create-community-modal.component';

@Component({
  selector: 'hv-explore-communities',
  standalone: true,
  imports: [CommonModule, FormsModule, CommunityCardComponent, EmptyStateComponent, CreateCommunityModalComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent implements OnInit {
  private groupService = inject(GroupService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  groups: Group[] = [];
  loading = true;
  search = '';
  showCreateModal = false;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search') ?? '';
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.groupService.list(this.search).subscribe({
      next: (res) => {
        this.groups = res.groups;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onCreated(group: Group): void {
    this.showCreateModal = false;
    this.toast.show('Community created!', 'success');
    this.groups = [group, ...this.groups];
  }
}
