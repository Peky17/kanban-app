import { Component } from '@angular/core';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css'],
})
export class BucketsComponent {
  buckets: Bucket[] = [];

  constructor(private bucketService: BucketService) {}

  ngOnInit(): void {
    this.bucketService.getBuckets().subscribe({
      next: (data) => {
        this.buckets = data;
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  confirmDelete(id: number, name: string): void {
    Swal.fire({
      title: 'Do you want to delete this Bucket?',
      text: `Bucket: ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBucket(id);
      }
    });
  }

  deleteBucket(id: number): void {
    this.bucketService.deleteBucketById(id).subscribe(
      () => {
        Swal.fire(
          'Deleted',
          'The bucket has been deleted successfully',
          'success'
        );
        window.location.reload();
      },
      (error) => {
        Swal.fire('Error', 'There was a problem deleting the bucket.', 'error');
      }
    );
  }
}
