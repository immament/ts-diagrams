import {DiagramElement, DiagramLink} from '@common/ClassDiagram';
import {prepareToPrintNode} from 'src/ts/utils/prepareToPrintNode';
import {Node} from 'ts-morph';
import {Reference} from '../ReferenceSearcher';

export class LinksBuilder {
  constructor(private items: WeakMap<Node, DiagramElement>) {}

  create(ref: Reference): DiagramLink {
    return new DiagramLink(
      this.getElementId(ref.from),
      this.getElementId(ref.to),
      ref.type
    );
  }

  private getElementId(node: Node) {
    if (!this.items.get(node)?.id) {
      console.log(prepareToPrintNode([node, this.items.get(node)]));
    }
    return this.items.get(node)?.id ?? 'no-element';
  }
}
