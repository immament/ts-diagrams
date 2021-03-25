/* eslint-disable node/no-unpublished-import */
import {ClassDiagramDTO, DiagramElementDTO, LinkElementDTO} from 'common';

export interface DiagramContent<E, L> {
  elements: E[];
  links: L[];
}

export type DiagramElementCreator<T> = (element: DiagramElementDTO) => T;
export type DiagramLinkCreator<L, E> = (
  link: LinkElementDTO,
  elements: Map<string, E>
) => L;

export interface Creators<E, L> {
  element: Map<string, DiagramElementCreator<E>>;
  defaultElement: DiagramElementCreator<E>;
  link: Map<string, DiagramLinkCreator<L, E>>;
  defaultLink: DiagramLinkCreator<L, E>;
}

export class DiagramFactory<E, L> {
  constructor(private creatorsMapper: Creators<E, L>) {}

  create(skeleton: ClassDiagramDTO): DiagramContent<E, L> {
    const idsToElements = new Map<string, E>();
    const cells = skeleton.elements.map(e => {
      const element = this.createCell(e);
      idsToElements.set(e.id, element);
      return element;
    });
    return {
      elements: cells,
      links: skeleton.links.map(l => this.createLink(l, idsToElements)),
    };
  }

  private createCell(src: DiagramElementDTO) {
    return (
      this.creatorsMapper.element.get(src.kind) ??
      this.creatorsMapper.defaultElement
    )(src);
  }

  private createLink(link: LinkElementDTO, idsToElements: Map<string, E>) {
    return (
      this.creatorsMapper.link.get(link.kind) ?? this.creatorsMapper.defaultLink
    )(link, idsToElements);
  }
}
