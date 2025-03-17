import { Component, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { ModalComponent } from '../modal/modal.component';
import { EditorComponent } from './editor/editor.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-notes',
  imports: [NzTableModule, TreeViewComponent, ModalComponent, EditorComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  constructor(private service: DashboardService) {}
  @ViewChild(TreeViewComponent) treeViewComponent!: TreeViewComponent;
  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
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
