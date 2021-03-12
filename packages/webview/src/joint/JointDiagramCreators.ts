import * as joint from 'jointjs';
import {
  Creators,
  DiagramElementCreator,
  DiagramLinkCreator,
} from '../diagram/DiagramFactory';
import {SkeletonLink} from '../diagram/DiagramSkeleton';
import {UmlAbstract, UmlClass, UmlInterface} from './uml';
import {DirectedAssociation} from './uml/DirectedAssociation';
import {UmlUnknown} from './uml/UmlUnknown';

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

function umlClassCreator(
  ctor: UmlClassConstructor
): DiagramElementCreator<BaseType> {
  return element => {
    return new ctor({
      name: [element.name],
      properties: element.properties,
      methods: element.methods,
    });
  };
}

function umlLinkCreator(
  ctor: LinkConstructor
): DiagramLinkCreator<LinkBaseType, BaseType> {
  return (link: SkeletonLink, idsToElement: Map<string, BaseType>) => {
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
