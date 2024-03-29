import {HttpClient} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {AdminService} from '../admin.service';

@Component({
  selector: 'app-atlas-position-sync-manual',
  templateUrl: './atlas-position-sync-manual.component.html',
  styleUrls: ['./atlas-position-sync-manual.component.css']
})
export class AtlasPositionSyncManualComponent implements OnInit {
  positionId: string = '';
  message: string = '';

  ngOnInit(): void {}

  constructor(public adminService: AdminService) {}

  syncPosition() {
    if (!this.positionId) {
      alert('Please enter a position ID.');
      return;
    }

    this.adminService.syncPosition(this.positionId).subscribe({
      next: (response: { message: string }) => {
        this.message = response.message;
      },
      error: (error: any) => {
        console.error('Error syncing position:', error.message);
        alert('An error occurred while syncing the position. Please try again.');
      }
    });
  }

}
