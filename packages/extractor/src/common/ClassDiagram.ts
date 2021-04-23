import {ClassDiagramDTO, DiagramElementDTO, LinkElementDTO} from 'common';

export interface toDTO<T> {
  toDTO(): T;
}

export class ClassDiagram implements toDTO<ClassDiagramDTO> {
  constructor(
    private elements: DiagramElement[],
    private links: DiagramLink[]
  ) {}

  getElements() {
    return [...this.elements];
  }

  getLinks(): DiagramLink[] {
    return [...this.links];
  }

  toDTO(): ClassDiagramDTO {
    const elementsDTO = this.elements.map(el => ({el, dto: el.toDTO()}));

    return {
      elements: elementsDTO.map(item => item.dto),
      links: this.links.map(l => l.toDTO()),
    };
  }
}

export interface DiagramElement extends toDTO<DiagramElementDTO> {
  readonly id: string;
  readonly kind: string;
  readonly name: string;
}

export abstract class ClassLikeElement implements DiagramElement {
  readonly id: string;
  constructor(
    public readonly kind: string,
    public readonly name: string,
    protected methods: Method[] = [],
    protected properties: Property[] = []
  ) {
    this.id = nextId();
  }

  getProperties() {
    return this.properties;
  }
  getMethods() {
    return this.methods;
  }

  toDTO(): DiagramElementDTO {
    return {
      id: this.id,
      kind: 'uml.' + this.kind,
      name: this.name,
      methods: getIfHasElements(this.getMethods()),
      properties: getIfHasElements(this.getProperties()),
    };
  }
}

export class ClassElement extends ClassLikeElement {
  constructor(
    name: string,
    methods: Method[] = [],
    properties: Property[] = [],
    protected accessors: Accessor[] = []
  ) {
    super('Class', name, methods, properties);
  }

  getAccessors() {
    return this.accessors;
  }

  toDTO(): DiagramElementDTO {
    return {
      ...super.toDTO(),
      accessors: getIfHasElements(this.getAccessors()),
    };
  }
}

export class InterfaceElement extends ClassLikeElement {
  constructor(
    name: string,
    methods: Method[] = [],
    properties: Property[] = []
  ) {
    super('Interface', name, methods, properties);
  }

  toDTO(): DiagramElementDTO {
    return super.toDTO();
  }
}

export interface Method {
  accessModifier: AccessModifier;
  name: string;
  returnType: string;
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  type: string;
}

export interface Property {
  accessModifier: AccessModifier;
  name: string;
  type: string;
}

export interface Accessor {
  accessModifier: AccessModifier;
  name: string;
  type: string;
}

export class FunctionElement implements DiagramElement {
  readonly id: string;
  readonly kind = 'Function';

  constructor(
    public name: string,
    public returnType: string,
    public parameters: Parameter[] = []
  ) {
    this.id = nextId();
  }

  toDTO(): DiagramElementDTO {
    return {
      id: this.id,
      kind: 'uml.' + this.kind,
      name: this.name,
      type: this.returnType,
      parameters: getIfHasElements(this.parameters),
    };
  }
}

export class VariableElement implements DiagramElement {
  readonly kind = 'Variable';
  readonly id: string;

  constructor(public name: string, public type: string) {
    this.id = nextId();
  }

  toDTO(): DiagramElementDTO {
    return {
      id: this.id,
      kind: 'uml.' + this.kind,
      name: this.name,
      type: this.type,
    };
  }
}

export type AccessModifier = 'public' | 'private' | 'protected';

function getIfHasElements<T>(arr: T[]): T[] | undefined {
  return arr.length ? arr : undefined;
}

let lastId = 0;

function nextId() {
  return (++lastId).toString();
}

function mapLinkType(type: string) {
  switch (type) {
    case 'extends':
      return 'uml.Generalization';
    case 'implements':
      return 'uml.Generalization';

    default:
      return 'unknown';
  }
}

export class DiagramLink implements toDTO<LinkElementDTO> {
  constructor(
    public fromId: string,
    public toId: string,
    public type: string
  ) {}

  toDTO(): LinkElementDTO {
    return {
      fromId: this.fromId,
      toId: this.toId,
      kind: mapLinkType(this.type),
    };
  }
}
