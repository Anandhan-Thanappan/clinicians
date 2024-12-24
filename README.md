


I have implements a dynamic hierarchical tree using Angular Material's `mat-tree` and integrates drag-and-drop functionality to manage groups in the tree for clinicians. The clinicians tree do actions like adding, editing, and deleting nodes, along with lazy loading of child nodes, based on hierarchical data.

## Features

- **Tree Structure**: Nodes can have children, and the tree not achieved expand and collapse.
https://material.angular.io/components/tree/overview


# Angular Material Tree with Drag-and-Drop
- **Drag-and-Drop**: drag-and-drop for rearranging nodes  - Not able to acheive.
https://material.angular.io/cdk/drag-drop/overview

- **Add/Remove/Edit Nodes**: adding, editing, and deleting nodes in the tree structure.
- **Lazy Loading**: Children nodes are loaded dynamically for children nodes.
- **Hover Menu**: actions (`Add Group`, `Edit Group`, `Delete Group`) appear on hovering over each node.
---

## Installation
1. Angular CLI 14.2.13
2. Node.js v14.21.3 and npm 6.14.18, TypeScript 4.7.2

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Anandhan-Thanappan/clinicians.git
   ```

2. Navigate to the project directory:
   ```bash
   cd clinicians
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Check Angular Material installed:
   If not, install Angular Material by running:
   ```bash
   ng add @angular/material
   ```

5. Start the development server:
   ```bash
   ng serve or npx ng serve
   ```

  Open browser and enter this `http://localhost:4200`.

---

## How It Works

### Tree Component (`tree.component.ts`)

1. **Tree Control**: Uses Angular CDK's `NestedTreeControl` to manage nested groups and their structure.
2. **Data Source**: Uses `MatTreeNestedDataSource` to connect hierarchical data to the tree.
3. **Group Model**: Defines a `Group` interface with properties for `id`, `name`, `type`, and `children`. The children are optional and can be loaded dynamically.
4. **Drag and Drop**: Integrated with CDK's `drag-drop` module, you can drag and drop nodes in the tree or across containers.
5. **Hover Effects**: When hovering over a node, buttons for adding, editing, and deleting become visible, allowing quick actions.
6. **Actions**: 
   - **Add Group**: Adds a new child node under the selected node.
   - **Edit Group**: Edits the name of the selected group.
   - **Delete Group**: Removes the selected group (confirmation prompt).

