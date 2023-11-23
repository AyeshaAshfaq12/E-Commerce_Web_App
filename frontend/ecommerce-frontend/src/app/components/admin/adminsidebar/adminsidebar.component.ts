import { Component } from '@angular/core';
import { SharedToggleService } from 'src/app/services/shared-toggle.service';

@Component({
  selector: 'app-adminsidebar',
  templateUrl: './adminsidebar.component.html',
  styleUrls: ['./adminsidebar.component.css'],
})
export class AdminsidebarComponent {
  isOpen: Boolean = true;
  currency: String = 'PKR';
  amount: Number = 32789.95;

  constructor(private sharedToggleService: SharedToggleService) {}
  ngOnInit(): void {
    this.sharedToggleService.isOpen$.subscribe((isOpen) => {
      this.isOpen = isOpen;
    });
  }
  toggleSideBar() {
    this.sharedToggleService.toggleSideBar();
  }
}
