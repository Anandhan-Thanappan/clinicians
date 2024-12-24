import { ChangeDetectorRef, Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Group } from 'src/app/models/group.model';
import { GroupService } from 'src/app/services/group.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent {
  treeControl = new NestedTreeControl<Group>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<Group>();
  filteredDataSource = new MatTreeNestedDataSource<Group>(); // For search functionality
  expandedNodes: Set<Group> = new Set<Group>(); // Manually track expanded nodes
  searchKey: string = ''; // Search input value

  constructor(private groupService: GroupService, private cdr: ChangeDetectorRef) {
    this.loadGroups();

    // Subscribe to changes from the service
    this.groupService.groups$.subscribe((groups) => {
      this.dataSource.data = [...groups];
      this.filteredDataSource.data = [...groups]; // Initialize filteredDataSource
    });
  }

  loadGroups(): void {
    this.groupService.fetchInitialGroups();
  }

  hasChild = (_: number, node: Group) => !!node.children && node.children.length > 0;

  addChild(parent: Group): void {
    const name = prompt('Enter child name:');
    if (name) {
      this.groupService.addChild(parent.id, name);
    }
  }

  editGroup(node: Group): void {
    const name = prompt('Enter new group name:', node.name);
    if (name) {
      this.groupService.editGroup(node.id, name);
    }
  }

  deleteGroup(node: Group): void {
    if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
      this.groupService.deleteGroup(node.id);
    }
  }

  loadLazyChildren(node: Group): void {
    this.groupService.loadLazyChildren(node.id);
  }

  // Toggle the accordion for expanding/collapsing nodes
  toggleAccordion(node: Group): void {
    if (this.expandedNodes.has(node)) {
      this.treeControl.collapse(node);
      this.expandedNodes.delete(node); // Collapse node
    } else {
      this.expandedNodes.forEach((expandedNode) => {
        this.treeControl.collapse(expandedNode); // Collapse all other nodes
      });
      this.treeControl.expand(node); // Expand current node
      this.expandedNodes.clear(); // Reset expanded nodes
      this.expandedNodes.add(node); // Add current node
    }
  }

  // Handle drag-and-drop (this example integrates drag-drop module logic)
  onDrop(event: CdkDragDrop<Group[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.groupService.updateHierarchy(this.dataSource.data);
  }

  // Get node class based on dynamic level
  getNodeClass(node: Group, level: number = 0): string {
    return `level-${level}`;
  }

  // Track levels by recursion while rendering the tree
  getNodeLevel(node: Group, level: number = 0): number {
    return level;
  }

  // Filter tree nodes based on the search key
  filterTree(): void {
    if (this.searchKey.trim() === '') {
      // Reset to full tree if the search key is empty
      this.filteredDataSource.data = [...this.dataSource.data];
    } else {
      const filteredNodes = this.filterNodes(this.dataSource.data, this.searchKey.toLowerCase());
      this.filteredDataSource.data = filteredNodes;
    }
  }

  // Recursive filtering function
  private filterNodes(nodes: Group[], searchKey: string): Group[] {
    return nodes
      .map((node) => ({ ...node }))
      .filter((node) => {
        const matchesKey = node.name.toLowerCase().includes(searchKey);
        const filteredChildren = node.children
          ? this.filterNodes(node.children, searchKey)
          : [];
        if (matchesKey || filteredChildren.length > 0) {
          node.children = filteredChildren; // Retain matched children
          return true;
        }
        return false;
      });
  }
}
