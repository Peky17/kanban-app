import { Component } from '@angular/core';
import { Badge } from 'src/app/interfaces/badge.interface';
import { BadgeService } from 'src/app/services/badge.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css'],
})
export class BadgesComponent {
  badges: Badge[] = [];

  constructor(private badgeService: BadgeService) {}

  ngOnInit(): void {
    this.badgeService.getBadges().subscribe({
      next: (data) => {
        this.badges = data;
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  confirmDelete(id: number, name: string): void {
    Swal.fire({
      title: 'Do you want to delete this badge?',
      text: `Badge: ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBadge(id);
      }
    });
  }

  deleteBadge(id: number): void {
    this.badgeService.deleteBadgeById(id).subscribe(
      () => {
        Swal.fire(
          'Deleted',
          'The badge has been deleted successfully',
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
