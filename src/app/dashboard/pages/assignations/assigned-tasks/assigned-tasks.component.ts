import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigned-tasks',
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.css']
})
export class AssignedTasksComponent implements OnInit {

  ngOnInit(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch your assigned tasks.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simulate data fetching logic
    setTimeout(() => {
      Swal.close(); // Close the loader
    }, 2000); // Replace with actual data fetching logic
  }
}
