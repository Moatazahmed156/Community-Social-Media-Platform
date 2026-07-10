import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReactionSummary, ReactionType } from '../models/reaction.model';

@Injectable({ providedIn: 'root' })
export class ReactionService {
  constructor(private http: HttpClient) {}

  private base(postId: string) {
    return `${environment.apiUrl}/posts/${postId}/reactions`;
  }

  list(postId: string): Observable<ReactionSummary> {
    return this.http.get<ReactionSummary>(this.base(postId));
  }

  set(postId: string, type: ReactionType) {
    return this.http.post<{ reaction: unknown }>(this.base(postId), { type });
  }

  remove(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.base(postId));
  }
}
