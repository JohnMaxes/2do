import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TreeViewComponent } from './tree-view/tree-view.component';

@Component({
  selector: 'app-notes',
  imports: [NzTableModule, TreeViewComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {

}
