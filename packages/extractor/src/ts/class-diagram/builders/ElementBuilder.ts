import {DiagramElement} from '@common/ClassDiagram';
import {Node} from 'ts-morph';

export interface ElementBuilder {
  create(node: Node): DiagramElement;
}
