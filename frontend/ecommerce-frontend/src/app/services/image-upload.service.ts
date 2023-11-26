import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Images } from 'Models/product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImages(id: String, images: File[]): Observable<any> {
    const formData = new FormData();
    const num = images.length < 4 ? images.length : 4;
    formData.append('name', 'a.png');
    for (let i = 0; i < num; i++) {
      formData.append('files', images[i]);
    }

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post(`${this.apiUrl}/images/upload/${id}`, formData, {
      headers,
    });
  }
  // getImages(id: String): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/images/get/${id}`);
  // }

  deletMany(id: String, images: Images[]): Observable<any> {
    // alert(images);
    return this.http.post(`${this.apiUrl}/images/deleteMany/${id}`, {
      images: images,
    });
  }

  // bufferToImage(buffer: any, mimeType: string): string {
  //   alert(buffer);

  //   const base64Image = btoa(String.fromCharCode(...new Uint8Array(buffer)));

  //   return `data:${mimeType};base64,${base64Image}`;
  // }

  // getArrayBufferFromFile(file: File): Observable<any> {
  //   const formData = new FormData();
  //   // formData.append('name', 'a.png');
  //   // for (let i = 0; i < 4; i++) {
  //   formData.append('files', file);
  //   // }

  //   const headers = new HttpHeaders();
  //   headers.set('Content-Type', 'multipart/form-data');

  //   const a = this.http.post(`${this.apiUrl}/images/post`, formData, {
  //     headers,
  //   });

  //   return a;
  // }
}
