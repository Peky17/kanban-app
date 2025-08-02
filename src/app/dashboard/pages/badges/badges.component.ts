import { Component } from '@angular/core';
import { Badge } from 'src/app/interfaces/badge.interface';
import { BadgeService } from 'src/app/services/badge.service';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css'],
})
export class BadgesComponent {
  badges: Badge[] = [];
  filteredBadges: Badge[] = [];
  paginator: Paginator<Badge> = new Paginator([], 5);
  searchTerm: string = '';

  constructor(private badgeService: BadgeService) {}

  ngOnInit(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch the badges.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.badgeService.getBadges().subscribe({
      next: (data) => {
        this.badges = data;
        this.filteredBadges = data;
        this.paginator.setItems(data);
        setTimeout(() => Swal.close(), 500);
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to load badges.', 'error');
      },
    });
  }
  filterData() {
    if (!this.searchTerm) {
      this.filteredBadges = this.badges;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBadges = this.badges.filter(badge =>
        badge.text.toLowerCase().includes(term) ||
        badge.id.toString().includes(term) ||
        (badge.color && badge.color.toLowerCase().includes(term))
      );
    }
    this.paginator.setItems(this.filteredBadges);
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
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
