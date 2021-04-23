import {SyntaxKind} from 'ts-morph';
import {
  prepareToPrint,
  prepareToPrintArray,
  PrepareToPrintOptions,
  SimpleObject,
} from './prepareToPrint';

export function prepareToPrintNodeArray(
  objects?: (object | undefined)[],
  options?: PrepareToPrintOptions
) {
  return prepareToPrintArray(
    objects as SimpleObject[],
    prepareOptions(options)
  );
}

export function prepareToPrintNode(
  node?: object,
  options: PrepareToPrintOptions = {}
): unknown {
  return node && prepareToPrint(node as SimpleObject, prepareOptions(options));
}

function prepareOptions({
  ignoreKeys,
  cilcularObjKeys,
  initFn,
  ...options
}: PrepareToPrintOptions = {}) {
  ignoreKeys ??= [
    'kind',
    'parent',
    //'pos',
    //'end',
    'flags',
    'modifierFlagsCache',
    'transformFlags',
    'flowNode',
    'checker',
    '_context',
    '__sourceFile',
    'declarations',
  ];

  return {
    ...options,
    ignoreKeys,
    cilcularObjKeys: cilcularObjKeys ?? ['kind', 'id'],
    initFn: initFn ?? createNodeObj,
  };
}

function syntaxKindText(kind: SyntaxKind): string {
  return SyntaxKind[kind];
}

function createNodeObj(obj: SimpleObject): Record<string, unknown> {
  const node = obj as {kind?: SyntaxKind};
  return node.kind
    ? {kindText: `${syntaxKindText(node.kind)} (${node.kind})`}
    : {};
}
