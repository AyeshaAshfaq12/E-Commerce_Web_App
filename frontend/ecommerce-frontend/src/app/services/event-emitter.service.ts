import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  hideDialogEvent = new EventEmitter<void>();
  reloadEvent = new EventEmitter<void>();
  // Add more events as needed

  // Method to trigger the hideDialogEvent
  triggerHideDialog() {
    this.hideDialogEvent.emit();
  }
  triggerReload() {
    this.reloadEvent.emit();
  }
}
