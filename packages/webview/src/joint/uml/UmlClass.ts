import * as joint from 'jointjs';

const marginX = 6;
const marginsX = marginX * 2;
const marginY = 4;
const marginsY = 8;
const minWidth = 90;
const cornerRadius = 4;

export const UML_UPDATE_EVENT = 'uml-update';
export const NAME_TEXT_SELECTOR = '.uml-class-name-text';
export const PROPERTIES_TEXT_SELECTOR = '.uml-class-attrs-text';
export const METHODS_TEXT_SELECTOR = '.uml-class-methods-text';

export enum UmlClassRects {
  name = '.uml-class-name-rect',
}

export class UmlClass extends joint.shapes.basic.Generic {
  constructor(
    attributes?: joint.shapes.uml.UmlClassAttributes,
    opt?: joint.dia.Graph.Options
  ) {
    super(attributes, opt);
    this.listenFieldsChanges();

    this.updateTexts();
  }

  defaults(): Record<string, unknown> {
    return {
      ...super.defaults,
      type: 'uml.UmlClass',
      attrs: {
        '.uml-class-name-rect': {
          fill: '#f38451',
          rx: cornerRadius,
        },
        '.uml-class-attrs-rect': {
          ref: '.uml-class-name-rect',
          refY: '100%',
          fill: '#f4976b',
          rx: cornerRadius,
        },
        '.uml-class-methods-rect': {
          ref: '.uml-class-attrs-rect',
          refY: '100%',
          fill: '#f4976b',
          rx: cornerRadius,
        },
        '.uml-class-name-text': {
          ref: '.uml-class-name-rect',
          refY: marginY,
          refX: '50%',
          textAnchor: 'middle',
        },
        '.uml-class-attrs-text': {
          ref: '.uml-class-attrs-rect',
          refY: marginY,
          x: marginX,
        },
        '.uml-class-methods-text': {
          ref: '.uml-class-methods-rect',
          refY: marginY,
          x: marginX,
        },
      },

      name: [],
      properties: [],
      methods: [],
    };
  }

  markup = [
    '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
    '<text class="uml-class-name-text"/><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
  ].join('');

  private listenFieldsChanges() {
    this.on(
      'change:name change:properties change:methods',
      () => this.updateTexts(),
      this
    );
  }

  private getTextNodeClassName(type: string) {
    return '.uml-class-' + type + '-text';
  }

  getClassName(): string[] {
    return this.get('name');
  }

  private updateTexts(): void {
    const attrs = this.get('attrs');

    const nodes: {type: string; lines: string[]}[] = [
      {type: 'name', lines: this.getClassName()},
      {type: 'attrs', lines: this.get('properties')},
      {type: 'methods', lines: this.get('methods')},
    ];

    nodes.forEach(node => {
      attrs[this.getTextNodeClassName(node.type)].text = node.lines.join('\n');
    });
    this.trigger(UML_UPDATE_EVENT);
  }
}

const UML_FIELDS_UPDATE = 'UML_FIELDS_UPDATE';

export class UmlClassView extends joint.dia.ElementView {
  initialize(options?: Backbone.ViewOptions<UmlClass>) {
    this.initFlag = joint.dia.ElementView.prototype.initFlag.concat(
      UML_FIELDS_UPDATE
    );

    // this.presentationAttributes = joint.dia.ElementView.addPresentationAttributes(
    //   {
    //     size: ['UML_SIZE_UPDATE'],
    //     name: [UML_FIELDS_UPDATE],
    //     properties: [UML_FIELDS_UPDATE],
    //     methods: [UML_FIELDS_UPDATE],
    //   }
    // );

    this.listenTo(this.model, UML_UPDATE_EVENT, () => {
      this.update();
      this.requestUpdate(this.getFlag(UML_FIELDS_UPDATE));
    });

    super.initialize(options);
  }

  private updateRectHeight(textKey: string | null | undefined, height: number) {
    if (!textKey) return;
    this.model.attr(`.${textKey.replace('-text', '-rect')}/height`, height);
  }

  private resizeElements(): joint.dia.Size {
    return Array.from(
      (this.findBySelector('text') as unknown) as JQuery<SVGElement>
    ).reduce(
      (size, elem) => {
        const shape = this.getNodeBBox(elem);

        const heightWithMargin =
          shape.height + this.calculateMargin(shape.height);

        this.updateRectHeight(elem.getAttribute('class'), heightWithMargin);

        size.height += heightWithMargin;
        size.width = Math.max(size.width, shape.width + marginsX);
        return size;
      },
      {width: minWidth, height: 0}
    );
  }

  private calculateMargin(height: number) {
    return height > 0 ? marginsY : 0;
  }

  updateSize() {
    const size = this.resizeElements();

    this.model
      .attr('.uml-class-name-rect/width', size.width)
      .attr('.uml-class-attrs-rect/width', size.width)
      .attr('.uml-class-methods-rect/width', size.width);

    this.model.resize(size.width, size.height);

    this.update();
  }

  confirmUpdate(flag: number, opt: Record<string, unknown>): number {
    let flags = super.confirmUpdate(flag, opt);

    if (this.hasFlag(flags, UML_FIELDS_UPDATE)) {
      // console.log(UML_FIELDS_UPDATE);
      this.updateSize();
      flags = this.removeFlag(flags, UML_FIELDS_UPDATE);
    }

    return flags;
  }
}

Object.assign(joint.shapes.uml, {
  UmlClass,
  UmlClassView,
});
