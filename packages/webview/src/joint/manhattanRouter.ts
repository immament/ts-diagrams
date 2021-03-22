import * as joint from 'jointjs';

export const manhattanRouter = function (
  vertices: joint.dia.Point[],
  opt?: joint.routers.ManhattanRouterArguments,
  linkView?: joint.dia.LinkView
) {
  return joint.routers.manhattan(
    vertices,
    {...opt, padding: {left: 50, right: 50, top: 50, bottom: 50}},
    linkView
  );
};
