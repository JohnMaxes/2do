import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTreeFlatDataSource, NzTreeFlattener, NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Node } from '../../../model/note-node.type';
import { DashboardService } from '../../../services/dashboard.service';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';


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
  providers: [DashboardService]
})
export class TreeViewComponent implements OnInit {
  isLoading = true;
  service = inject(DashboardService);
  Notes: Node[];

  /////////////////////////// Render
  ngOnInit(): void {
    this.isLoading = false;
  }

  constructor () {
    this.Notes = this.service.noteArr;
    this.dataSource.setData(this.Notes);
  }

  isFolder = (_:number, node: ExampleFlatNode): boolean => (node.type === 'folder');
  isEmptyFolder = (_:number, node: ExampleFlatNode): boolean => (node.type === 'folder' && !node.expandable);
  isNotebook = (_:number, node: ExampleFlatNode): boolean => (node.type === 'notebook');
  isEmptyNotebook = (_:number, node: ExampleFlatNode): boolean => (node.type === 'notebook' && !node.expandable);
  isNote = (_:number, node: ExampleFlatNode): boolean => (node.type === 'note');
  isNewNodePreview = (_:number, node: ExampleFlatNode): boolean => (node.type === 'new');
  //////////////////////////// Render



  //////////////////////////// Note CRUD
  //////////////////////////// Note CRUD  
  newNodeType: string = '';
  newNodeName: string = '';
  newNodeIcon: string = '';
  newNodeParentRef: any;
  expansionState = new Map<string, boolean>();

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

  focusItem(id: string) {
    let newNodeRef = this.getNode(id);
    if(newNodeRef) this.selectListSelection.select(newNodeRef);
  }

  findNodeById(nodes: Node[], id: string): Node | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  saveExpansionState() {
    this.expansionState = new Map<string, boolean>();
    this.treeControl.dataNodes.forEach(node => {
      this.expansionState.set(node.id, this.treeControl.isExpanded(node));
    });
  }

  restoreExpansionState() {
    this.treeControl.dataNodes.forEach(node => {
      if (this.expansionState.get(node.id)) {
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
      this.newNodeParentRef = this.findNodeById(this.Notes, parentId);
      this.newNodeParentRef.children.unshift({id: 'new', name: '', type: 'new', createdAt: new Date(), updatedAt: new Date()});
      this.dataSource.setData(this.Notes);
      this.focusItem('new');
    }
    else {
      this.Notes.unshift({id: 'new', name: '', type: 'new', createdAt: new Date(), updatedAt: new Date()});
      this.dataSource.setData(this.Notes);
    }
    this.restoreExpansionState();
    this.expandParent();
    console.log(this.Notes);
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.saveExpansionState();
      if (this.newNodeParentRef !== undefined) {
        console.log(this.newNodeParentRef);
        console.log('New item with type: ' + this.newNodeType + ', name: ' + this.newNodeName);
        if (this.newNodeType == 'notebook' || this.newNodeType == 'folder') {
          this.newNodeParentRef.children.unshift({ id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), children: [] });
        } else if (this.newNodeType == 'note') {
          this.newNodeParentRef.children.unshift({ id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), content: '' });
        }
        this.newNodeParentRef.children = this.newNodeParentRef.children.filter((note: Node) => note.id !== 'new');
        this.dataSource.setData(this.Notes);
        this.expandParent();
      } else {
        if (this.newNodeType == 'notebook' || this.newNodeType == 'folder') {
          this.Notes.unshift({ id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), children: [] });
        } else if (this.newNodeType == 'note') {
          this.Notes.unshift({ id: 'sth', name: this.newNodeName, type: this.newNodeType, createdAt: new Date(), updatedAt: new Date(), content: '' });
        }
        this.Notes = this.Notes.filter((note) => note.id !== 'new');
        this.dataSource.setData(this.Notes);
      }
      this.restoreExpansionState();
      this.focusItem('sth');
    }
  }

  removeNodeById(nodes: Node[], id: string): Node[] {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) node.children = this.removeNodeById(node.children, id);
      return true;
    })
  }
  
  @Output() warnDelete = new EventEmitter<string>();

  showDeleteWarn() {
    this.warnDelete.emit('This action cannot be reversed. Are you sure?');
  }

  deleteNote() {
    this.saveExpansionState();
    let selectedId = this.selectListSelection.selected[0].id;
    this.Notes = this.removeNodeById(this.Notes, selectedId);
    this.dataSource.setData(this.Notes);
    this.restoreExpansionState();
  }
  //////////////////////////// Note CRUD
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
}
