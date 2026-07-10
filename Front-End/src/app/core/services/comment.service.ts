import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  private base(postId: string) {
    return `${environment.apiUrl}/posts/${postId}/comments`;
  }

  list(postId: string): Observable<{ comments: Comment[]; total: number }> {
    return this.http.get<{ comments: Comment[]; total: number }>(this.base(postId));
  }

  create(postId: string, content: string): Observable<{ comment: Comment }> {
    return this.http.post<{ comment: Comment }>(this.base(postId), { content });
  }

  delete(postId: string, commentId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base(postId)}/${commentId}`);
  }
}
