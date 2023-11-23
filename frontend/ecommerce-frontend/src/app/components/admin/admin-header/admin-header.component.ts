import { Component } from '@angular/core';
import { SharedToggleService } from 'src/app/services/shared-toggle.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent {
  constructor(private sharedToggleService: SharedToggleService) {}

  toggleSideBar(): void {
    this.sharedToggleService.toggleSideBar();
  }
}
