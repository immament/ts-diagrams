import {ClassDiagramDTO, DiagramElementDTO} from 'common';

export interface toDTO<T> {
  toDTO(): T;
}

export class ClassDiagram implements toDTO<ClassDiagramDTO> {
  constructor(private elements: DiagramElement[]) {}

  getElements() {
    return [...this.elements];
  }

  toDTO(): ClassDiagramDTO {
    return {
      elements: this.getElements().map(e => e.toDTO()),
      links: [],
    };
  }
}

export interface DiagramElement extends toDTO<DiagramElementDTO> {
  kind: string;
  name: string;
}

export abstract class ClassLikeElement implements DiagramElement {
  kind: string;
  constructor(
    public name: string,
    protected methods: Method[] = [],
    protected properties: Property[] = []
  ) {
    this.kind = 'ClassLikeElement';
  }

  getProperties() {
    return this.properties;
  }
  getMethods() {
    return this.methods;
  }

  toDTO(): DiagramElementDTO {
    return {
      id: nextId(),
      kind: 'uml.' + this.kind,
      name: this.name,
      methods: getIfHasElements(this.getMethods()),
      properties: getIfHasElements(this.getProperties()),
    };
  }
}

export class ClassElement extends ClassLikeElement {
  kind: string;
  constructor(
    name: string,
    methods: Method[] = [],
    properties: Property[] = [],
    protected accessors: Accessor[] = []
  ) {
    super(name, methods, properties);
    this.kind = 'Class';
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
    super(name, methods, properties);
    this.kind = 'Interface';
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
  kind = 'Function';

  constructor(
    public name: string,
    public returnType: string,
    public parameters: Parameter[] = []
  ) {}

  toDTO(): DiagramElementDTO {
    return {
      id: nextId(),
      kind: 'uml.' + this.kind,
      name: this.name,
      type: this.returnType,
      parameters: getIfHasElements(this.parameters),
    };
  }
}

export class VariableElement implements DiagramElement {
  kind = 'Variable';

  constructor(public name: string, public type: string) {}

  toDTO(): DiagramElementDTO {
    return {
      id: nextId(),
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
