// eslint-disable-next-line node/no-unpublished-import
import {ClassDiagramDTO} from 'common';
import * as dagre from 'dagre';
import * as joint from 'jointjs';
import {debounce} from 'lodash';
import {DiagramFactory} from '../diagram/factory/DiagramFactory';
import {jointCreatorsMapper} from './jointDiagramCreators';
import {manhattanRouter} from './manhattanRouter';
import './uml';

export function createDiagram(
  el: HTMLElement,
  options: {
    width?: joint.dia.Paper.Dimension;
    height?: joint.dia.Paper.Dimension;
    diagram?: ClassDiagramDTO;
  } = {}
) {
  const diagram = new JoindClassDiagram(el, options);
  options.diagram && diagram.create(options.diagram);
  return diagram;
}

export class JoindClassDiagram {
  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;

  private marginX = 10;
  private marginY = 10;

  private resizeObserver?: ResizeObserver;

  constructor(
    private el: HTMLElement,
    private options: {
      width?: joint.dia.Paper.Dimension;
      height?: joint.dia.Paper.Dimension;
    } = {}
  ) {
    this.graph = this.createGraph();
    this.paper = this.createPaper(this.graph);
  }

  dispose() {
    this.resizeObserver?.disconnect();
  }

  refresh(diagram: ClassDiagramDTO) {
    this.create(diagram);
  }

  create(diagram: ClassDiagramDTO) {
    const cells = this.createDiagramContent(diagram);
    this.graph.resetCells(cells, {});
    this.layout();
    this.listenSizeChange();
    this.resizeWrapper();
  }

  private createPaper(graph: joint.dia.Graph) {
    return new joint.dia.Paper({
      el: this.el,
      model: graph,
      width: this.options.width ?? '100%',
      height: this.options.height ?? '100%',
      gridSize: 1,
      theme: 'dark',
      cellViewNamespace: joint.shapes,
      defaultConnector: {name: 'rounded'},
      defaultRouter: manhattanRouter,
      //defaultConnectionPoint: {name: 'bbox', args: {}},
      //defaultAnchor: {name: 'left'},
      //perpendicularLinks: false,
    });
  }

  private createDiagramContent(diagram: ClassDiagramDTO): joint.dia.Cell[] {
    if (diagram) {
      const factory = new DiagramFactory(jointCreatorsMapper);
      const content = factory.create(diagram);

      return [...content.elements, ...content.links];
    }
    return [];
  }

  private createGraph() {
    return new joint.dia.Graph();
  }

  private listenSizeChange() {
    this.resizeObserver = new ResizeObserver(
      debounce(() => this.resizeWrapper(), 500)
    );

    if (this.el.parentElement) {
      this.resizeObserver.observe(this.el.parentElement);
    }

    this.resizeObserver.observe(this.paper.viewport);
  }

  private resizeWrapper() {
    const area = this.paper.getContentArea();

    this.el.style.height = this.calculateCssDimension(
      area.height + area.y + this.marginY,
      this.el.parentElement?.clientHeight
    );

    this.el.style.width = this.calculateCssDimension(
      area.width + area.x + this.marginX,
      this.el.parentElement?.clientWidth
    );
  }

  private calculateCssDimension(size: number, minSize = 0) {
    return Math.max(size, minSize).toString() + 'px';
  }

  private layout() {
    joint.layout.DirectedGraph.layout(this.graph, {
      dagre: dagre,
      graphlib: dagre.graphlib,
      marginX: this.marginX,
      marginY: this.marginY,
      nodeSep: 10,
      edgeSep: 20,
      rankDir: 'BT',
    });
  }
}
