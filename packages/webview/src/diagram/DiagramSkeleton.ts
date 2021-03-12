export interface SkeletonElement {
  id: string;
  type: string;
  name: string;
  properties?: string[];
  methods?: string[];
}

export interface SkeletonLink {
  id?: string;
  fromId: string;
  toId: string;
  type: string;
  name?: string;
}

export interface DiagramSkeleton {
  elements: SkeletonElement[];
  links: SkeletonLink[];
}
