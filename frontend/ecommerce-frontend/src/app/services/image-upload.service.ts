import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImages(id: String, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('name', 'a.png');
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post<any>(`${this.apiUrl}/images/upload/${id}`, formData, {
      headers,
    });
  }
}
