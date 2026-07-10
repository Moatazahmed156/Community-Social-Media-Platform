import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post, PostStatus } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  private base(groupId: string) {
    return `${environment.apiUrl}/groups/${groupId}/posts`;
  }

  list(
    groupId: string,
    status?: PostStatus,
    page = 1,
    limit = 20
  ): Observable<{ posts: Post[]; total: number }> {
    const params: Record<string, string | number> = { page, limit };
    if (status) params['status'] = status;
    return this.http.get<{ posts: Post[]; total: number }>(this.base(groupId), { params });
  }

  getById(groupId: string, postId: string): Observable<{ post: Post }> {
    return this.http.get<{ post: Post }>(`${this.base(groupId)}/${postId}`);
  }

  create(groupId: string, content: string, images: File[] = []): Observable<{ post: Post }> {
    const form = new FormData();
    form.append('content', content);
    images.forEach((f) => form.append('images', f));
    return this.http.post<{ post: Post }>(this.base(groupId), form);
  }

  update(groupId: string, postId: string, content: string): Observable<{ post: Post }> {
    return this.http.put<{ post: Post }>(`${this.base(groupId)}/${postId}`, { content });
  }

  approve(groupId: string, postId: string): Observable<{ post: Post }> {
    return this.http.patch<{ post: Post }>(`${this.base(groupId)}/${postId}/approve`, {});
  }

  reject(groupId: string, postId: string, reason?: string): Observable<{ post: Post }> {
    return this.http.patch<{ post: Post }>(`${this.base(groupId)}/${postId}/reject`, { reason });
  }

  delete(groupId: string, postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base(groupId)}/${postId}`);
  }
}
