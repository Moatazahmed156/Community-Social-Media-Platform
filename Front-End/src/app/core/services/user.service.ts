import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.apiUrl, { params: { search: query } });
  }

  updateProfile(payload: { firstName?: string; lastName?: string; bio?: string; username?: string }) {
    return this.http.put<{ user: User }>(`${this.apiUrl}/me`, payload);
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<{ message: string }>(`${this.apiUrl}/me/password`, {
      currentPassword,
      newPassword,
    });
  }

  uploadProfilePicture(file: File) {
    const form = new FormData();
    form.append('profilePicture', file);
    return this.http.put<{ user: User }>(`${this.apiUrl}/me/profile-picture`, form);
  }

  uploadCoverPicture(file: File) {
    const form = new FormData();
    form.append('coverPicture', file);
    return this.http.put<{ user: User }>(`${this.apiUrl}/me/cover-picture`, form);
  }

  deleteAccount() {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/me`);
  }
}
