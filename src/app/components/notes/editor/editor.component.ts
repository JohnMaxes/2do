import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar, Validators, toHTML, toDoc } from 'ngx-editor';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Node } from '../../../model/node.type';
import { NotesService } from '../notes.service';
import { Subscription } from 'rxjs';

const EMPTY_DOC = {
  type: 'doc',
  content: [{ type: 'paragraph' }]
};

@Component({
  selector: 'app-editor',
  imports: [NgxEditorModule, ReactiveFormsModule, FormsModule, NzIconModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnDestroy, AfterViewChecked {
  isLoading: boolean = true;
  targetDocument: Node | undefined;
  private selectionSub: Subscription;

  constructor(private notesService: NotesService, private el: ElementRef) {
    this.editor = new Editor();
    this.selectionSub = this.notesService.selectedNote$.subscribe(note => {
      if (note && note.type === 'note') {
        if(typeof note.content === 'string') this.currHTML = note.content;
        else this.currHTML = toHTML(note.content)
        this.targetDocument = note;
        this.isLoading = false;
        this.formControl.setValue(this.currHTML, { emitEvent: false });
      } else {
        this.targetDocument = undefined;
        this.currHTML = '';
        this.isLoading = true;
        this.formControl.setValue(toHTML(EMPTY_DOC), { emitEvent: false });
      }
    });

    // Save changes back to the note when the editor changes
    this.formControl.valueChanges.subscribe(value => {
      if (this.targetDocument && this.targetDocument.type == 'note') {
        this.targetDocument.content = toDoc(this.currHTML);
      }
    });
  }

  currHTML: string = '';
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['undo', 'redo'],
  ];

  formControl = new FormControl(toHTML(EMPTY_DOC));

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.selectionSub.unsubscribe();
    this.editor.destroy();
  }

  ngAfterViewChecked(): void {
    const editorMenu = document.getElementsByClassName('NgxEditor__MenuBar')[0] as HTMLElement;
    if(editorMenu) editorMenu.style.border = '1px solid rgba(0, 0, 0, .2)';
    const editor = document.getElementsByClassName('NgxEditor')[0] as HTMLElement;
    if(editor) {
      editor.style.border = 'none';
      editor.style.minHeight = '95vh';
    }
  }
}
