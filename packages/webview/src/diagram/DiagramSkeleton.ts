export interface SkeletonElement {
  type: string;
  name: string;
  properties?: string[];
  methods?: string[];
}

export interface DiagramSkeleton {
  elements: SkeletonElement[];
}
