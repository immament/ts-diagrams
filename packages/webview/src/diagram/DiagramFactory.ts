import {DiagramSkeleton, SkeletonElement} from './DiagramSkeleton';

export interface DiagramContent<T> {
  cells: T[];
}

export type DiagramElementCreator<T> = (element: SkeletonElement) => T;

export class DiagramFactory<T> {
  constructor(
    private typeMapper: Map<string, DiagramElementCreator<T>>,
    private defualtCreator: DiagramElementCreator<T>
  ) {}

  create(options: DiagramSkeleton): DiagramContent<T> {
    return {
      cells: options.elements.map(e => this.createCell(e)),
    };
  }

  createCell(element: SkeletonElement) {
    const creator = this.typeMapper.get(element.type);
    if (creator) {
      return creator(element);
    }

    return this.defualtCreator(element);
  }
}
