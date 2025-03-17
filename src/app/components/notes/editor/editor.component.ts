import { Component, ElementRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QuillModule } from 'ngx-quill';
import { DashboardService } from '../../../services/dashboard.service';
import { Node } from '../../../model/node.type';

@Component({
  selector: 'app-editor',
  imports: [QuillModule, FormsModule, NzIconModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements AfterViewChecked {
  isLoading: boolean;
  targetDocument: Node | undefined;
  text: string = '';

  constructor(private el: ElementRef, private dashboard: DashboardService) {
    let curr = this.dashboard.currentSelectedNode;
    if(curr && curr.type == 'note') this.targetDocument = dashboard.currentSelectedNode;
    this.isLoading = true;
  }

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ 'color': [] }, { 'background': [] }], // dropdown with defaults
      [{ 'font': [] }],
      ['link', 'image', 'video'],
      ['clean'] // remove formatting button
    ]
  };

  loadNewNote(note: Node) {
    console.log('Load new note called!');
    this.targetDocument = note;
    if(note.type == 'note') this.text = note.content;
    this.isLoading = false;
  }

  unloadNote() {
    console.log('unload node called');
    this.targetDocument = undefined;
    this.text = '';
    this.isLoading = true;
  }

  ngAfterViewChecked(): void {
    this.isLoading == false;
    let editorRef = this.el.nativeElement.querySelectorAll('.editorContainer');
    const height = editorRef.offsetHeight;
  }
}
