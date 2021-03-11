/* eslint-disable @typescript-eslint/no-namespace */
import * as joint from 'jointjs';

declare module 'jointjs' {
  namespace shapes {
    namespace uml {
      interface UmlClassAttributes
        extends dia.Element.GenericAttributes<SVGRectSelector> {
        name: string[];
        properties?: string[];
        methods?: string[];
      }

      class UmlClass extends joint.shapes.basic.Generic {
        constructor(
          attributes?: UmlClassAttributes,
          opt?: {[key: string]: unknown}
        );

        getClassName(): string[];
      }

      class UmlClassView extends joint.dia.ElementView {}

      class UmlInterface extends UmlClass {}

      class UmlInterfaceView extends UmlClassView {}

      class UmlAbstract extends UmlClass {}

      class UmlAbstractView extends UmlClassView {}
    }
  }
}
