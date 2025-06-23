import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { ModalComponent } from '../modal/modal.component';
import { DashboardService } from '../../services/dashboard.service';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-notes',
  imports: [NzTableModule, TreeViewComponent, ModalComponent, EditorComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  constructor(private service: DashboardService) {}
  showModal = false;
  modalMessage = '';
  noteIdToDelete: string | null = null;

  triggerModal(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  handleModalResponse(response: boolean) {
    if (response) {
      // Find the tree-view component and call deleteNote
      // Since we don't have a ViewChild, rely on event flow:
      // TreeViewComponent should handle deletion after modal confirmation.
      // We'll use a custom event to trigger deleteNote from here.
      const treeView = document.querySelector('app-tree-view') as any;
      if (treeView && treeView.deleteNote) {
        treeView.deleteNote();
      }
    }
    this.showModal = false;
  }
}
