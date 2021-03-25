import * as joint from 'jointjs';
import {UmlClass, UmlClassView} from './UmlClass';

export class UmlUnknown extends UmlClass {
  defaults(): Record<string, unknown> {
    const def = joint.util.defaultsDeep(
      {
        type: 'uml.UmlUnknown',
        attrs: {
          '.uml-class-name-rect': {fill: '#f6b663'},
          '.uml-class-attrs-rect': {fill: '#f8c886'},
          '.uml-class-methods-rect': {fill: '#f8c886'},
        },
      },
      {...super.defaults()}
    );
    return def as Record<string, unknown>;
  }
}

export class UmlUnknownView extends UmlClassView {}

Object.assign(joint.shapes.uml, {
  UmlUnknown,
  UmlUnknownView,
});
