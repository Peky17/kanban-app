import { Component } from '@angular/core';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrls: ['./buckets.component.css'],
})
export class BucketsComponent {
  buckets: Bucket[] = [];
  filteredBuckets: Bucket[] = [];
  paginator: Paginator<Bucket> = new Paginator([], 5);
  searchTerm: string = '';

  constructor(private bucketService: BucketService) {}

  ngOnInit(): void {
    this.bucketService.getBuckets().subscribe({
      next: (data) => {
        this.buckets = data;
        this.filteredBuckets = data;
        this.paginator.setItems(data);
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }
  filterData() {
    if (!this.searchTerm) {
      this.filteredBuckets = this.buckets;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBuckets = this.buckets.filter(bucket =>
        bucket.name.toLowerCase().includes(term) ||
        bucket.id.toString().includes(term) ||
        (bucket.description && bucket.description.toLowerCase().includes(term)) ||
        (bucket.createdAt && bucket.createdAt.toLowerCase().includes(term)) ||
        bucket.board.id.toString().includes(term)
      );
    }
    this.paginator.setItems(this.filteredBuckets);
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
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
