import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, EventEmitter, AfterViewChecked, ElementRef, Output, OnDestroy } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Node } from '../../../model/node.type';
import { DashboardService } from '../../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NotesService } from '../notes.service';
import { Subscription } from 'rxjs';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  type: string;
  name: string;
  level: number;
  disabled: boolean;
  id: string;
  children?: Node[];
}

@Component({
  selector: 'app-tree-view',
  imports: [NzIconModule, NzTreeViewModule, NzButtonModule, FormsModule, NzInputModule],
  templateUrl: './tree-view.component.html',
})
export class TreeViewComponent implements OnInit, AfterViewChecked, OnDestroy {
  isLoading = true;
  Notes: Node[] = [];
  private notesSub: Subscription;
  /////////////////////////// Render
  constructor (
    private el: ElementRef,
    private service: DashboardService,
    private notesService: NotesService
  ) {
    // Subscribe to notes changes
    this.notesSub = this.notesService.notes$.subscribe(notes => {
      this.Notes = notes;
      this.dataSource.setData(this.Notes);
    });
  }

  ngOnInit() {
    if(this.service.currentExpansionState !== undefined) {
      this.expansionState = this.service.currentExpansionState;
      this.restoreExpansionState();
    }
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }

  isFolder = (_:number, node: ExampleFlatNode): boolean => (node.type === 'folder');
  isEmptyFolder = (_:number, node: ExampleFlatNode): boolean => (node.type === 'folder' && !node.expandable);
  isNotebook = (_:number, node: ExampleFlatNode): boolean => (node.type === 'notebook');
  isEmptyNotebook = (_:number, node: ExampleFlatNode): boolean => (node.type === 'notebook' && !node.expandable);
  isNote = (_:number, node: ExampleFlatNode): boolean => (node.type === 'note');
  isNewNodePreview = (_:number, node: ExampleFlatNode): boolean => (node.type === 'new');

  
  //////////////////////////// Note CRUD  
  newNodeType: string = '';
  newNodeName: string = '';
  newNodeIcon: string = '';
  newNodeParentRef: any;
  expansionState: Map<string, boolean> | undefined = undefined;

  getNode(id: string): ExampleFlatNode | null {
    return this.treeControl.dataNodes.find(n => n.id === id) || null;
  }
  
  expandParent() {
    let parent;
    if(this.newNodeParentRef) {
      parent = this.getNode(this.newNodeParentRef.id);
      if(parent) this.treeControl.expand(parent);
    }
  }

  ngAfterViewChecked() {
    let toggleButtons = this.el.nativeElement.querySelectorAll('nz-tree-node-toggle:not([nzTreeNodeNoopToggle])');
    toggleButtons.forEach((button: HTMLElement) => {
      button.onclick = () => {
        console.log('expansion toggled');
        this.saveExpansionState();
      }
    })
  }

  focusItem(id: string) {
    let newNodeRef = this.getNode(id);
    if(newNodeRef) this.selectListSelection.select(newNodeRef);
  }

  findNodeById(nodes: Node[], id: string): Node | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  saveExpansionState() {
    this.expansionState = new Map<string, boolean>();
    this.service.currentExpansionState = new Map<string,boolean>();
    this.treeControl.dataNodes.forEach(node => {
      this.expansionState!.set(node.id, this.treeControl.isExpanded(node));
    });
    this.service.currentExpansionState = this.expansionState;
    console.log(this.service.currentExpansionState);
  }

  restoreExpansionState() {
    this.treeControl.dataNodes.forEach(node => {
      if (this.expansionState!.get(node.id)) {
        this.treeControl.expand(node);
      } else {
        this.treeControl.collapse(node);
      }
    });
  }

  addNotePreview(newType: string) {
    this.newNodeName = '';
    this.newNodeParentRef = undefined;
    this.newNodeIcon = '';
    this.newNodeType = newType;
    if(newType == 'notebook') this.newNodeIcon = 'book';
    if(newType == 'note') this.newNodeIcon = 'file-text';

    let parentId: string;
    this.saveExpansionState();
    if(this.selectListSelection.hasValue()) {
      parentId = this.selectListSelection.selected[0].id;
      // Use recursive findNodeById
      this.newNodeParentRef = this.findNodeById(this.notesService.getNotes(), parentId) || undefined;
      if (this.newNodeParentRef && this.newNodeParentRef.children) {
        this.newNodeParentRef.children.unshift({id: 'new', name: '', type: 'new', createdAt: new Date(), updatedAt: new Date()});
      }
      this.notesService.setNotes([...this.notesService.getNotes()]);
      setTimeout(() => this.focusItem('new'), 0);
    }
    else {
      this.notesService.setNotes([
        {id: 'new', name: '', type: 'new', createdAt: new Date(), updatedAt: new Date()},
        ...this.notesService.getNotes()
      ]);
      setTimeout(() => this.focusItem('new'), 0);
    }
    this.restoreExpansionState();
    this.expandParent();
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.saveExpansionState();
      if (this.newNodeParentRef !== undefined) {
        if (this.newNodeType == 'notebook' || this.newNodeType == 'folder') {
          this.notesService.addNote(
            this.newNodeParentRef.id,
            { id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), children: [] }
          );
        } else if (this.newNodeType == 'note') {
          this.notesService.addNote(
            this.newNodeParentRef.id,
            { id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), content: '' }
          );
        }
        // Remove preview node
        this.newNodeParentRef.children = this.newNodeParentRef.children.filter((note: Node) => note.id !== 'new');
        this.notesService.setNotes([...this.notesService.getNotes()]);
        this.expandParent();
      } else {
        if (this.newNodeType == 'notebook' || this.newNodeType == 'folder') {
          this.notesService.addNote(
            null,
            { id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), children: [] }
          );
        } else if (this.newNodeType == 'note') {
          this.notesService.addNote(
            null,
            { id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), content: '' }
          );
        }
        // Remove preview node
        this.notesService.setNotes(this.notesService.getNotes().filter((note) => note.id !== 'new'));
      }
      this.restoreExpansionState();
      setTimeout(() => this.focusItem('sth'), 0);
    }
  }

  @Output() warnDelete = new EventEmitter<string>();

  showDeleteWarn() {
    // Only show modal if a node is selected
    if (this.selectListSelection.hasValue()) {
      this.warnDelete.emit('This action cannot be reversed. Are you sure?');
    }
  }

  deleteNote() {
    this.saveExpansionState();
    let selectedId = this.selectListSelection.selected[0]?.id;
    if (!selectedId) return;
    this.notesService.removeNote(selectedId);
    this.selectListSelection.clear();
    this.restoreExpansionState();
  }

  //////////////////////////// Note CRUD

  private transformer = (node: Node, level: number): ExampleFlatNode => {
    const flatNode: ExampleFlatNode = {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      type: node.type,
      level,
      disabled: false,
      id: node.id,
    };
    return flatNode;
  };
  selectListSelection = new SelectionModel<ExampleFlatNode>();

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  handleNoteSelection(node: ExampleFlatNode) {
    // Only select/deselect if not a "new" node preview
    if (node.type === 'new') {
      this.selectListSelection.toggle(node);
      return;
    }
    if (this.selectListSelection.isSelected(node)) {
      this.notesService.deselectNote();
      this.service.currentSelectedNode = undefined;
    } else {
      // Find the node in the notes tree (deep search)
      const found = this.findNodeById(this.Notes, node.id);
      if (found) {
        this.notesService.selectNote(found);
        this.service.currentSelectedNode = found;
      }
    }
    this.selectListSelection.toggle(node);
  }
}