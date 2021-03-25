import * as joint from 'jointjs';
import {UmlClass, UmlClassRects, UmlClassView} from './UmlClass';

export class UmlAbstract extends UmlClass {
  defaults() {
    const def = joint.util.defaultsDeep(
      {
        type: 'uml.UmlAbstract',
        attrs: {
          [UmlClassRects.name]: {fill: '#f1c40f'},
          '.uml-class-attrs-rect': {fill: '#f39c12'},
          '.uml-class-methods-rect': {fill: '#f39c12'},
        },
      },
      {...super.defaults()}
    );

    return def as Record<string, unknown>;
  }

  getClassName(): string[] {
    return ['<<abstract>>', ...this.get('name')];
  }
}

export class UmlAbstractView extends UmlClassView {}

Object.assign(joint.shapes.uml, {
  UmlAbstract,
  UmlAbstractView,
});
