export interface ClassDiagramDTO {
  elements: DiagramElementDTO[];
  links: LinkElementDTO[];
}

export interface DiagramElementDTO {
  id: string;
  kind: string;
  name: string;
  methods?: Method[];
  properties?: Property[];
  accessors?: Accessor[];
  type?: string;
  parameters?: Parameter[];
}

export type LinkElementDTO = {
  id?: string;
  kind: string;
  fromId: string;
  toId: string;
  name?: string;
};

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
