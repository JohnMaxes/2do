import { Component, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QuillModule } from 'ngx-quill';
import { Node } from '../../../model/node.type';
import { NotesService } from '../notes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor',
  imports: [QuillModule, FormsModule, NzIconModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements AfterViewChecked, OnDestroy {
  isLoading: boolean = true;
  targetDocument: Node | undefined;
  private selectionSub: Subscription;

  constructor(
    private el: ElementRef,
    private notesService: NotesService
  ) {
    this.selectionSub = this.notesService.selectedNote$.subscribe(note => {
      if (note && note.type === 'note') {
        this.targetDocument = note;
        this.isLoading = false;
      } else {
        this.targetDocument = undefined;
        this.isLoading = true;
      }
    });
  }

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  ngAfterViewChecked(): void {
    // No-op or implement as needed
  }

  ngOnDestroy(): void {
    this.selectionSub.unsubscribe();
  }
}
