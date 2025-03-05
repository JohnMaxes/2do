interface BaseNode {
    id: string;
    name: string;
    type: 'notebook' | 'folder' | 'note' | 'new';
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface FolderNode extends BaseNode {
    type: 'folder';
    children: Node[];
  }
  
  interface NoteNode extends BaseNode {
    type: 'note';
    content: string;
    children?: never; // TextNode cannot have children
  }
  
  interface NotebookNode extends BaseNode {
    type: 'notebook';
    content?: string;
    children?: Node[];
  }

  interface NewNodePreview extends BaseNode {
    type: 'new';
    content?: never;
    children?: never;
  }
  
  export type Node = FolderNode | NoteNode | NotebookNode | NewNodePreview;