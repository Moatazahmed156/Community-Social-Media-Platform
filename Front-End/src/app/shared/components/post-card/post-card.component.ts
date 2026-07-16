import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { ReactionSummary, ReactionType } from '../../../core/models/reaction.model';
import { GroupRole } from '../../../core/models/group.model';
import { User } from '../../../core/models/user.model';
import { PostService } from '../../../core/services/post.service';
import { CommentService } from '../../../core/services/comment.service';
import { ReactionService } from '../../../core/services/reaction.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarComponent } from '../avatar/avatar.component';
import { FileUrlPipe } from '../../pipes/file-url.pipe';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

const REACTIONS: { type: ReactionType; emoji: string }[] = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'haha', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
  { type: 'sad', emoji: '😢' },
  { type: 'angry', emoji: '😡' },
];

@Component({
  selector: 'hv-post-card',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent, FileUrlPipe, TimeAgoPipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  @Input({ required: true }) groupId!: string;
  @Input() groupRole: GroupRole | null = null;
  @Input() showModerationBadge = true;

  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<Post>();

  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private reactionService = inject(ReactionService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  reactions = REACTIONS;
  summary: ReactionSummary | null = null;
  showComments = false;
  comments: Comment[] = [];
  loadingComments = false;
  newComment = '';
  showReactionPicker = false;

  editing = false;
  editContent = '';
  submitting = false;

  showReactionsModal = false;

  ngOnInit(): void {
    this.loadReactions();
  }

  get currentUser(): User | null {
    return this.auth.currentUser();
  }

  get author(): User | null {
    return typeof this.post.authorId === 'object' ? this.post.authorId : null;
  }

  get isAuthor(): boolean {
    const authorId = typeof this.post.authorId === 'object' ? this.post.authorId._id : this.post.authorId;
    return authorId === this.currentUser?._id;
  }

  get isModerator(): boolean {
    return this.groupRole === 'owner' || this.groupRole === 'admin';
  }

  get canDelete(): boolean {
    return this.isAuthor || this.isModerator;
  }

  loadReactions(): void {
    this.reactionService.list(this.post._id).subscribe({
      next: (res) => (this.summary = res),
      error: () => {},
    });
  }

  react(type: ReactionType): void {
    this.showReactionPicker = false;
    this.reactionService.set(this.post._id, type).subscribe({
      next: () => this.loadReactions(),
      error: () => {},
    });
  }

  removeReaction(): void {
    this.reactionService.remove(this.post._id).subscribe({
      next: () => this.loadReactions(),
      error: () => {},
    });
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
    if (this.showComments && this.comments.length === 0) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.loadingComments = true;
    this.commentService.list(this.post._id).subscribe({
      next: (res) => {
        this.comments = res.comments;
        this.loadingComments = false;
      },
      error: () => (this.loadingComments = false),
    });
  }

  submitComment(): void {
    const content = this.newComment.trim();
    if (!content) return;

    this.commentService.create(this.post._id, content).subscribe({
      next: (res) => {
        this.comments = [...this.comments, res.comment];
        this.newComment = '';
      },
      error: () => {},
    });
  }

  deleteComment(commentId: string): void {
    this.commentService.delete(this.post._id, commentId).subscribe({
      next: () => (this.comments = this.comments.filter((c) => c._id !== commentId)),
      error: () => {},
    });
  }

  canDeleteComment(comment: Comment): boolean {
    const authorId = typeof comment.authorId === 'object' ? comment.authorId._id : comment.authorId;
    return authorId === this.currentUser?._id || this.isModerator;
  }

  commentAuthor(comment: Comment): User | null {
    return typeof comment.authorId === 'object' ? comment.authorId : null;
  }

  startEdit(): void {
    this.editing = true;
    this.editContent = this.post.content;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  saveEdit(): void {
    if (!this.editContent.trim()) return;
    this.submitting = true;
    this.postService.update(this.groupId, this.post._id, this.editContent.trim()).subscribe({
      next: (res) => {
        this.updated.emit(res.post);
        this.editing = false;
        this.submitting = false;
        this.toast.show('Post updated.', 'success');
      },
      error: () => {
        this.submitting = false;
      },
    });
  }

  approve(): void {
    this.postService.approve(this.groupId, this.post._id).subscribe({
      next: (res) => {
        this.updated.emit(res.post);
        this.toast.show('Post approved.', 'success');
      },
      error: () => {},
    });
  }

  reject(): void {
    const reason = prompt('Optional reason for rejecting this post:') || undefined;
    this.postService.reject(this.groupId, this.post._id, reason).subscribe({
      next: (res) => {
        this.updated.emit(res.post);
        this.toast.show('Post rejected.', 'info');
      },
      error: () => {},
    });
  }

  remove(): void {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    this.postService.delete(this.groupId, this.post._id).subscribe({
      next: () => {
        this.deleted.emit(this.post._id);
        this.toast.show('Post deleted.', 'success');
      },
      error: () => {},
    });
  }

  topReactionEmoji(): string {
    if (!this.summary || this.summary.total === 0) return '';
    const entries = Object.entries(this.summary.counts) as [ReactionType, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const top = entries[0]?.[0];
    return this.reactions.find((r) => r.type === top)?.emoji ?? '';
  }

  myReactionEmoji(): string {
    if (!this.summary?.myReaction) return '';
    return this.reactions.find((r) => r.type === this.summary!.myReaction)?.emoji ?? '';
  }

  emojiFor(type: ReactionType): string {
    return this.reactions.find((r) => r.type === type)?.emoji ?? '';
  }

  reactionUser(reaction: ReactionSummary['reactions'][number]): User | null {
    return typeof reaction.userId === 'object' ? reaction.userId : null;
  }

  openReactionsModal(): void {
    if (!this.summary || this.summary.total === 0) return;
    this.showReactionsModal = true;
  }
}
