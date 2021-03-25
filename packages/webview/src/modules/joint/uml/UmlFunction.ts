import * as joint from 'jointjs';
import {UmlClass, UmlClassView} from './UmlClass';

export class UmlFunction extends UmlClass {
  defaults(): Record<string, unknown> {
    const def = joint.util.defaultsDeep(
      {
        type: 'uml.UmlFunction',
        attrs: {
          '.uml-class-name-rect': {fill: '#f6b663'},
        },
      },
      {...super.defaults()}
    );
    return def as Record<string, unknown>;
  }

  getClassName(): string[] {
    return ['<<function>>', ...this.get('name')];
  }
}

export class UmlFunctionView extends UmlClassView {}

Object.assign(joint.shapes.uml, {
  UmlFunction,
  UmlFunctionView,
});
