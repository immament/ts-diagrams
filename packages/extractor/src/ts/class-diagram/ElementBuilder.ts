import {Node} from 'ts-morph';
import {DiagramElement} from '../../result/ClassDiagram';

export interface ElementBuilder {
  create(node: Node): DiagramElement;
}
