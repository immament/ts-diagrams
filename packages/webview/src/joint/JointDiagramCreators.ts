import * as joint from 'jointjs';
import {DiagramElementCreator} from '../diagram/DiagramFactory';
import {UmlAbstract, UmlClass, UmlInterface} from './uml';
import {UmlUnknown} from './uml/UmlUnknown';

type BaseType = joint.shapes.basic.Generic;

interface UmlClassConstructor {
  new (
    attributes?: joint.shapes.uml.UmlClassAttributes,
    opt?: joint.dia.Graph.Options
  ): UmlClass;
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

export const defualtJointCreator: DiagramElementCreator<BaseType> = umlClassCreator(
  UmlUnknown
);

export const jointCreatorsMapper = new Map<
  string,
  DiagramElementCreator<BaseType>
>([
  ['uml.Class', umlClassCreator(UmlClass)],
  ['uml.Interface', umlClassCreator(UmlInterface)],
  ['uml.Abstract', umlClassCreator(UmlAbstract)],
]);
