export class ClassDiagram {
  constructor(private elements: ClassLikeElement[]) {}

  getElements() {
    return [...this.elements];
  }
}

export interface DiagramElement {
  kind: string;
  name: string;
}

export class FunctionElement implements DiagramElement {
  kind = 'function';

  constructor(
    public name: string,
    public returnType: string,
    public parameters: Parameter[]
  ) {}
}

export class ClassLikeElement implements DiagramElement {
  kind: string;
  constructor(
    public name: string,
    protected methods: Method[] = [],
    protected properties: Property[] = [],
    protected accessors: Accessor[] = []
  ) {
    this.kind = 'ClassLikeElement';
  }

  getAccessors() {
    return this.accessors;
  }
  getProperties() {
    return this.properties;
  }
  getMethods() {
    return this.methods;
  }
}

export class ClassElement extends ClassLikeElement {}

export class InterfaceElement extends ClassLikeElement {}

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

export type AccessModifier = 'public' | 'private' | 'protected';
