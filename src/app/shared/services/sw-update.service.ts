import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  constructor(public updates: SwUpdate, private modalService: ModalService) {
    if (updates.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate().then(() => console.log('checking for updates')));
    }
  }

  public checkForUpdates(): void {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => this.promptUser());
    }
  }

  private promptUser(): void {
    this.modalService
      .open({
        title: 'App Update',
        message: 'An updated version of app is available, do you want to update?',
        okLabel: 'Yes',
        cancelLabel: 'No',
      })
      .then(
        () => {
          this.updates.activateUpdate().then(() => document.location.reload());
        },
        () => {},
      );
  }
}
