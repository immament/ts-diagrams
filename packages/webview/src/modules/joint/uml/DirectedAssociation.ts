import * as joint from 'jointjs';

export const DirectedAssociation = joint.dia.Link.define(
  'uml.DirectedAssociation',
  {
    attrs: {'.marker-target': {d: 'M 10 0 L 0 5 L 10 10', fill: 'none'}},
  }
);
