import * as joint from 'jointjs';
import {UmlClass, UmlClassView} from './UmlClass';

export class UmlVariable extends UmlClass {
  defaults(): Record<string, unknown> {
    const def = joint.util.defaultsDeep(
      {
        type: 'uml.UmlVariable',
        attrs: {
          '.uml-class-name-rect': {fill: '#f6b663'},
        },
      },
      {...super.defaults()}
    );
    return def as Record<string, unknown>;
  }

  getClassName(): string[] {
    return ['<<var>>', ...this.get('name')];
  }
}

export class UmlVariableView extends UmlClassView {}

Object.assign(joint.shapes.uml, {
  UmlVariable,
  UmlVariableView,
});
