import { Component, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-notes',
  imports: [NzTableModule, TreeViewComponent, ModalComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  @ViewChild(TreeViewComponent) treeViewComponent!: TreeViewComponent

  showModal = false;
  modalMessage = '';
  noteIdToDelete: string | null = null;
  triggerModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  handleModalResponse(response: boolean) {
    if (response) {
      this.treeViewComponent.deleteNote();
    }
    this.showModal = false;
  }
}
