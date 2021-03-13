import {ClassDeclaration} from 'ts-morph';
import {ClassDiagram} from '../result/ClassDiagram';
import {ClassElementBuilder} from './ClassElementBuilder';

export class ClassDiagramBuilder {
  create({classes}: {classes: ClassDeclaration[]}) {
    const elements = classes.map(cd => new ClassElementBuilder().create(cd));
    const diagram = new ClassDiagram(elements);
    return diagram;
  }
}
