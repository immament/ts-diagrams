export class ClassDiagram {
  constructor(private elements: DiagramElement[]) {}

  getElements() {
    return [...this.elements];
  }
}

export interface DiagramElement {
  kind: string;
  name: string;
}

export class ClassLikeElement implements DiagramElement {
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
    public parameters: Parameter[]
  ) {}
}

export class VariableElement implements DiagramElement {
  kind = 'Variable';

  constructor(public name: string, public type: string) {}
}

export type AccessModifier = 'public' | 'private' | 'protected';
