import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Bucket } from '../interfaces/bucket.interface';

@Injectable({
  providedIn: 'root',
})
export class BucketService {
  private baseUrl = environment.baseUrl + '/buckets';

  constructor(private httpClient: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBuckets(): Observable<Bucket[]> {
    return this.httpClient.get<Bucket[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getBucketById(id: number): Observable<Bucket> {
    return this.httpClient.get<Bucket>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }

  getBucketsByBoard(id: number): Observable<Bucket[]> {
    return this.httpClient.get<Bucket[]>(
      this.baseUrl + '/buckets-board/' + id,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  createBucket(bucket: Bucket): Observable<Bucket> {
    return this.httpClient.post<Bucket>(this.baseUrl, bucket, {
      headers: this.getAuthHeaders(),
    });
  }

  updateBucket(id: number, bucket: Bucket): Observable<Bucket> {
    return this.httpClient.put<Bucket>(this.baseUrl + '/' + id, bucket, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBucketById(id: number): Observable<Bucket> {
    return this.httpClient.delete<Bucket>(this.baseUrl + '/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}
