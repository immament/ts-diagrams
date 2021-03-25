import * as joint from 'jointjs';
import {UmlClass, UmlClassView} from './UmlClass';

export class UmlInterface extends UmlClass {
  defaults(): Record<string, unknown> {
    const def = joint.util.defaultsDeep(
      {
        type: 'uml.UmlInterface',
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

  getClassName(): string[] {
    return ['<<interface>>', ...this.get('name')];
  }
}

export class UmlInterfaceView extends UmlClassView {}

Object.assign(joint.shapes.uml, {
  UmlInterface,
  UmlInterfaceView,
});
