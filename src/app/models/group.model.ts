export interface Group {
  id: number;
  name: string;
  type: string;
  children?: Group[];
}
