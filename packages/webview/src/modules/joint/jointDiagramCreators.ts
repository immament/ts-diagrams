// eslint-disable-next-line node/no-unpublished-import
import {
  AccessModifier,
  Accessor,
  LinkElementDTO,
  Method,
  Parameter,
  Property,
} from 'common';
import * as joint from 'jointjs';
import {
  Creators,
  DiagramElementCreator,
  DiagramLinkCreator,
} from '../diagram/factory/DiagramFactory';
import {UmlAbstract, UmlClass, UmlInterface} from './uml';
import {DirectedAssociation} from './uml/DirectedAssociation';
import {UmlFunction} from './uml/UmlFunction';
import {UmlUnknown} from './uml/UmlUnknown';
import {UmlVariable} from './uml/UmlVariable';

type BaseType = joint.shapes.basic.Generic;
type LinkBaseType = joint.dia.Link;

interface UmlClassConstructor {
  new (
    attributes?: joint.shapes.uml.UmlClassAttributes,
    opt?: joint.dia.Graph.Options
  ): UmlClass;
}

interface LinkConstructor {
  new (
    attributes?: joint.dia.Link.Attributes,
    opt?: joint.dia.Graph.Options
  ): joint.dia.Link;
}

function accessModifierToString(accessModifier: AccessModifier): string {
  switch (accessModifier) {
    case 'public':
      return '+';
    case 'protected':
      return '#';
    case 'private':
      return '-';
  }
}

function umlClassCreator(
  ctor: UmlClassConstructor
): DiagramElementCreator<BaseType> {
  return element => {
    return new ctor({
      name: [element.name],
      properties: [
        ...(element.properties?.map(propertyText) ?? []),
        ...(element.accessors?.map(propertyText) ?? []),
      ],
      methods: element.methods?.map(methodText),
    });
  };
}

function umlFunctionCreator(): DiagramElementCreator<BaseType> {
  return element => {
    return new UmlFunction({
      name: [
        `${element.name}(${parametersText(element.parameters ?? [])}): ${
          element.type
        }`,
      ],
    });
  };
}

function umlVariableCreator(): DiagramElementCreator<BaseType> {
  return element => {
    return new UmlVariable({
      name: [`${element.name}: ${element.type}`],
    });
  };
}

function methodText(m: Method): string {
  return `${accessModifierToString(m.accessModifier)} ${
    m.name
  }(${parametersText(m.parameters)}): ${m.returnType}`;
}

function propertyText(p: Property | Accessor) {
  return `${accessModifierToString(p.accessModifier)} ${p.name}: ${p.type}`;
}

function parametersText(params: Parameter[]): string {
  return params.map(p => `${p.name}: ${p.type}`).join(',');
}

function umlLinkCreator(
  ctor: LinkConstructor
): DiagramLinkCreator<LinkBaseType, BaseType> {
  return (link: LinkElementDTO, idsToElement: Map<string, BaseType>) => {
    const fromElement = idsToElement.get(link.fromId);
    const toElement = idsToElement.get(link.toId);
    return new ctor({
      source: {
        id: fromElement?.id,
        // linkAnchor: {
        //   name: 'connectionLength',
        //   args: {
        //     length: 40,
        //   },
        // },
      },
      target: {
        id: toElement?.id,
        // linkAnchor: {
        //   name: 'connectionLength',
        //   args: {
        //     length: 40,
        //   },
        // },
      },
    });
  };
}

export const jointCreatorsMapper: Creators<BaseType, LinkBaseType> = {
  element: new Map<string, DiagramElementCreator<BaseType>>([
    ['uml.Class', umlClassCreator(UmlClass)],
    ['uml.Interface', umlClassCreator(UmlInterface)],
    ['uml.Abstract', umlClassCreator(UmlAbstract)],
    ['uml.Function', umlFunctionCreator()],
    ['uml.Variable', umlVariableCreator()],
  ]),
  defaultElement: umlClassCreator(UmlUnknown),
  link: new Map<string, DiagramLinkCreator<LinkBaseType, BaseType>>([
    ['uml.Generalization', umlLinkCreator(joint.shapes.uml.Generalization)],
    ['uml.Aggregation', umlLinkCreator(joint.shapes.uml.Aggregation)],
    ['uml.Composition', umlLinkCreator(joint.shapes.uml.Composition)],
    ['uml.Association', umlLinkCreator(DirectedAssociation)],
  ]),
  defaultLink: umlLinkCreator(joint.dia.Link),
};
