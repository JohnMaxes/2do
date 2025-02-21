import { Component, input, Output, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  message = input<string>();
  response = output<boolean>();
  handleConfirmed() {
    this.response.emit(true);
  }
  handleCancelled() {
    this.response.emit(false);
  }
}
