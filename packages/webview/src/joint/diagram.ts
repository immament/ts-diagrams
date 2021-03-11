import * as dagre from 'dagre';
import * as joint from 'jointjs';
import {debounce} from 'lodash';
import {DiagramFactory} from '../diagram/DiagramFactory';
import {DiagramSkeleton} from '../diagram/DiagramSkeleton';
import {defualtJointCreator, jointCreatorsMapper} from './JointDiagramCreators';
import './uml';

export function diagram(
  el: HTMLElement,
  options: {
    width?: joint.dia.Paper.Dimension;
    height?: joint.dia.Paper.Dimension;
    skeleton?: DiagramSkeleton;
  } = {}
) {
  const graph = createGraph();
  createDiagramContent();
  const paper = createPaper();
  layout();
  listenParentResize();
  resizeWrapper();

  function createGraph() {
    return new joint.dia.Graph();
  }

  function createDiagramContent() {
    if (options.skeleton) {
      const factory = new DiagramFactory(
        jointCreatorsMapper,
        defualtJointCreator
      );

      const content = factory.create(options.skeleton);
      register(content.cells);
    }
  }

  function layout() {
    joint.layout.DirectedGraph.layout(graph, {
      dagre: dagre,
      graphlib: dagre.graphlib,
      marginX: 10,
      marginY: 10,
      nodeSep: 10,
      edgeSep: 20,
      rankDir: 'BT',
    });
  }

  function listenParentResize() {
    if (el.parentElement) {
      new ResizeObserver(debounce((e, o) => resizeWrapper(), 500)).observe(
        el.parentElement
      );
    }
  }

  function resizeWrapper() {
    const area = paper.getContentArea();

    el.style.height = calculateCssDimension(
      area.height,
      el.parentElement?.clientHeight
    );

    el.style.width = calculateCssDimension(
      area.width,
      el.parentElement?.clientWidth
    );
  }

  function calculateCssDimension(size: number, minSize = 0) {
    return Math.max(size, minSize ?? 0).toString() + 'px';
  }

  function register(items: joint.dia.Cell[]) {
    graph.addCell(items);
  }

  function createPaper() {
    return new joint.dia.Paper({
      el,
      model: graph,
      width: options.width ?? '100%',
      height: options.height ?? '100%',
      gridSize: 1,
      theme: 'dark',
      cellViewNamespace: joint.shapes,
    });
  }
}
