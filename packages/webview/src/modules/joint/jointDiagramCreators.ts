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
import {
  DirectedAssociation,
  UmlAbstract,
  UmlClass,
  UmlFunction,
  UmlInterface,
  UmlUnknown,
  UmlVariable,
} from './uml';

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

class JointCreator {
  private creatorsMapper: Creators<BaseType, LinkBaseType> = {
    element: new Map<string, DiagramElementCreator<BaseType>>([
      ['uml.Class', this.umlClassCreator(UmlClass)],
      ['uml.Interface', this.umlClassCreator(UmlInterface)],
      ['uml.Abstract', this.umlClassCreator(UmlAbstract)],
      ['uml.Function', this.umlFunctionCreator()],
      ['uml.Variable', this.umlVariableCreator()],
    ]),
    defaultElement: this.umlClassCreator(UmlUnknown),
    link: new Map<string, DiagramLinkCreator<LinkBaseType, BaseType>>([
      [
        'uml.Generalization',
        this.umlLinkCreator(joint.shapes.uml.Generalization),
      ],
      ['uml.Aggregation', this.umlLinkCreator(joint.shapes.uml.Aggregation)],
      ['uml.Composition', this.umlLinkCreator(joint.shapes.uml.Composition)],
      ['uml.Association', this.umlLinkCreator(DirectedAssociation)],
    ]),
    defaultLink: this.umlLinkCreator(joint.dia.Link),
  };

  getCreatorsMapper() {
    return this.creatorsMapper;
  }

  private umlClassCreator(
    ctor: UmlClassConstructor
  ): DiagramElementCreator<BaseType> {
    return element => {
      return new ctor({
        name: [element.name],
        properties: [
          ...(element.properties?.map(p => this.propertyText(p)) ?? []),
          ...(element.accessors?.map(a => this.propertyText(a)) ?? []),
        ],
        methods: element.methods?.map(m => this.methodText(m)),
      });
    };
  }

  private umlFunctionCreator(): DiagramElementCreator<BaseType> {
    return element => {
      return new UmlFunction({
        name: [
          `${element.name}(${this.parametersText(element.parameters ?? [])}): ${
            element.type
          }`,
        ],
      });
    };
  }

  private umlVariableCreator(): DiagramElementCreator<BaseType> {
    return element => {
      return new UmlVariable({
        name: [`${element.name}: ${element.type}`],
      });
    };
  }

  private methodText(m: Method): string {
    return `${this.accessModifierToString(m.accessModifier)} ${
      m.name
    }(${this.parametersText(m.parameters)}): ${m.returnType}`;
  }

  private propertyText(p: Property | Accessor) {
    return `${this.accessModifierToString(p.accessModifier)} ${p.name}: ${
      p.type
    }`;
  }

  private accessModifierToString(accessModifier: AccessModifier): string {
    switch (accessModifier) {
      case 'public':
        return '+';
      case 'protected':
        return '#';
      case 'private':
        return '-';
    }
  }

  private parametersText(params: Parameter[]): string {
    return params.map(p => `${p.name}: ${p.type}`).join(',');
  }

  private umlLinkCreator(
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
}

export const jointCreatorsMapper: Creators<
  BaseType,
  LinkBaseType
> = new JointCreator().getCreatorsMapper();
