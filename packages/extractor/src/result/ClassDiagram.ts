export class ClassDiagram {
  constructor(private elements: ClassElement[]) {}

  getElements() {
    return [...this.elements];
  }
}

export class ClassElement {
  constructor(
    private methods: Method[],
    private properties: Property[],
    private accessors: Accessor[]
  ) {}

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
