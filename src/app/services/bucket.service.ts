import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Bucket } from '../interfaces/bucket.interface';

@Injectable({
  providedIn: 'root',
})

export class BucketService {
  private baseUrl = environment.baseUrl + '/buckets';
  private bucketsSubject = new BehaviorSubject<Bucket[]>([]);
  public buckets$ = this.bucketsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadBuckets();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getBuckets(): Observable<Bucket[]> {
    return this.buckets$;
  }

  private loadBuckets(): void {
    this.httpClient.get<Bucket[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (buckets) => this.bucketsSubject.next(buckets),
      error: () => this.bucketsSubject.next([])
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
    return new Observable(observer => {
      this.httpClient.post<Bucket>(this.baseUrl, bucket, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBuckets();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  updateBucket(id: number, bucket: Bucket): Observable<Bucket> {
    return new Observable(observer => {
      this.httpClient.put<Bucket>(this.baseUrl + '/' + id, bucket, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBuckets();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  deleteBucketById(id: number): Observable<Bucket> {
    return new Observable(observer => {
      this.httpClient.delete<Bucket>(this.baseUrl + '/' + id, {
        headers: this.getAuthHeaders(),
      }).subscribe({
        next: (res) => {
          this.loadBuckets();
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // Versión duplicada eliminada, solo queda la versión reactiva
}
