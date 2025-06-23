import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Node } from '../../model/node.type';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  // Example static data (replace with your own structure if needed)
  private staticNotes: Node[] = [
    {
      id: '1',
      name: 'Fruit',
      type: 'folder',
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [
        { id: '2', name: 'Apple', type: 'folder', createdAt: new Date(), updatedAt: new Date(), children: [] },
        { id: '3', name: 'Banana', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Banana content</p>' },
        { id: '4', name: 'Fruit loops', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Fruit loops content</p>' }
      ]
    },
    {
      id: '5',
      name: 'Vegetables',
      type: 'folder',
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [
        {
          id: '6',
          name: 'Green',
          type: 'notebook',
          createdAt: new Date(),
          updatedAt: new Date(),
          children: [
            { id: '7', name: 'Broccoli', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Broccoli content</p>' },
            { id: '8', name: 'Brussels sprouts', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Brussels sprouts content</p>' }
          ]
        },
        {
          id: '9',
          name: 'Orange',
          type: 'folder',
          createdAt: new Date(),
          updatedAt: new Date(),
          children: [
            { id: '10', name: 'Pumpkins', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Pumpkins content</p>' },
            { id: '11', name: 'Carrots', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Carrots content</p>' }
          ]
        }
      ]
    },
    {
      id: '12',
      name: 'Notebooks',
      type: 'notebook',
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [
        { id: '13', name: 'Notebook 1', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Notebook 1 content</p>' },
        { id: '14', name: 'Notebook 2', type: 'note', createdAt: new Date(), updatedAt: new Date(), content: '<p>Notebook 2 content</p>' }
      ]
    },
    {
      id: '15',
      name: 'Notebooks',
      type: 'notebook',
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [],
    }
  ];

  private notesSubject = new BehaviorSubject<Node[]>(this.staticNotes);
  notes$ = this.notesSubject.asObservable();

  private selectedNoteSubject = new BehaviorSubject<Node | null>(null);
  selectedNote$ = this.selectedNoteSubject.asObservable();

  getNotes(): Node[] {
    return this.notesSubject.getValue();
  }

  setNotes(notes: Node[]) {
    this.notesSubject.next(notes);
  }

  // CRUD helpers (ghost code, no backend)
  addNote(parentId: string | null, newNode: Node) {
    let notes = this.getNotes();
    if (parentId) {
      const parent = this.findNodeById(notes, parentId);
      if (parent && parent.children) {
        parent.children.unshift(newNode);
      }
    } else {
      notes.unshift(newNode);
    }
    this.setNotes([...notes]);
  }

  updateNote(updatedNode: Node) {
    let notes = this.getNotes();
    this.updateNodeById(notes, updatedNode.id, updatedNode);
    this.setNotes([...notes]);
  }

  removeNote(id: string) {
    let notes = this.getNotes();
    notes = this.removeNodeById(notes, id);
    this.setNotes([...notes]);
    this.deselectNote();
  }

  private findNodeById(nodes: Node[], id: string): Node | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  private updateNodeById(nodes: Node[], id: string, updatedNode: Node): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes[i] = updatedNode;
        return true;
      }
      if (nodes[i].children) {
        if (this.updateNodeById(nodes[i].children!, id, updatedNode)) return true;
      }
    }
    return false;
  }

  private removeNodeById(nodes: Node[], id: string): Node[] {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) node.children = this.removeNodeById(node.children, id);
      return true;
    });
  }

  selectNote(note: Node) {
    this.selectedNoteSubject.next(note);
  }

  deselectNote() {
    this.selectedNoteSubject.next(null);
  }

  constructor() { }
}
