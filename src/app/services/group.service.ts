import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groups: Group[] = [];

  private groupSubject = new BehaviorSubject<Group[]>([]);
  groups$ = this.groupSubject.asObservable();

  // Fetch initial data
  fetchInitialGroups(): void {
    this.groups = [
      {
        id: 1,
        name: 'Hospital A',
        type: 'hospital',
        children: [
          {
            id: 2,
            name: 'Shoulder',
            type: 'diagnosis',
          },
          {
            id: 3,
            name: 'Stomach',
            type: 'diagnosis',
            children: [
              { 
                id: 4, 
                name: "Crohn's Disease", 
                type: 'sub-diagnosis' 
              },
              { 
                id: 5, 
                name: 'Irritable Bowel Syndrome', 
                type: 'sub-diagnosis' 
              },
            ],
          },
        ],
      },
      { 
        id: 6, 
        name: 'Hospital B', 
        type: 'hospital', 
        children: [] 
      },
      { 
        id: 7, 
        name: 'Hospital C', 
        type: 'hospital', 
        children: [] 
      },
    ];

    this.groupSubject.next(this.groups);
  }

  // Add a new group or member
  addChild(parentId: number, name: string): void {
    const newGroup: Group = { id: Date.now(), name, type: 'diagnosis', children: [] };
    const parent = this.findNode(parentId, this.groups);
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(newGroup);
      this.groupSubject.next(this.groups);
    }
  }

  // Edit an existing group
  editGroup(id: number, newName: string): void {
    const node = this.findNode(id, this.groups);
    if (node) {
      node.name = newName;
      this.groupSubject.next(this.groups);
    }
  }

  // Delete a group
  deleteGroup(id: number): void {
    this.groups = this.removeNode(id, this.groups);
    this.groupSubject.next(this.groups);
  }

  // Lazy load children
  loadLazyChildren(parentId: number): void {
    const parent = this.findNode(parentId, this.groups);
    if (parent && (!parent.children || parent.children.length === 0)) {
      setTimeout(() => {
        parent.children = [
          { id: Date.now(), name: 'Lazy Loaded Node 1', type: 'diagnosis', children: [] },
          { id: Date.now() + 1, name: 'Lazy Loaded Node 2', type: 'diagnosis', children: [] },
        ];
        this.groupSubject.next(this.groups);
      }, 1000); // Simulate delay for lazy loading
    }
  }

  // Update group hierarchy (after drag-and-drop)
  updateHierarchy(newHierarchy: Group[]): void {
    this.groups = newHierarchy;
    this.groupSubject.next(this.groups);
  }

  // Helper methods
  private findNode(id: number, nodes: Group[]): Group | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const child = this.findNode(id, node.children);
        if (child) return child;
      }
    }
    return undefined;
  }

  private removeNode(id: number, nodes: Group[]): Group[] {
    return nodes.filter((node) => {
      if (node.id === id) return false;
      if (node.children) node.children = this.removeNode(id, node.children);
      return true;
    });
  }
}
