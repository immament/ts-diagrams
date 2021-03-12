import * as joint from 'jointjs';

export function createPaper(
  graph: joint.dia.Graph,
  el: HTMLElement = document.createElement('div')
) {
  return new joint.dia.Paper({
    el,
    model: graph,
    width: '300',
    height: '300',
    cellViewNamespace: joint.shapes,
  });
}

export function expectTexts(
  view: joint.dia.ElementView | joint.dia.LinkView,
  expected: [string, string, string]
) {
  const svgElems = Array.from(view.findBySelector('text'));

  svgElems.forEach((elem, index) =>
    expect(elem.textContent).toEqual(
      joint.Vectorizer.sanitizeText(expected[index])
    )
  );
}

export function expectText(
  view: joint.dia.ElementView | joint.dia.LinkView,
  selector: string,
  expected: string
) {
  const svgElem = view.findBySelector(selector)[0];

  expect(svgElem.textContent).toEqual(joint.Vectorizer.sanitizeText(expected));
}
