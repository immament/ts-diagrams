import {ts, Type} from 'ts-morph';

export function printType(type: Type<ts.Type>) {
  console.log(
    check(type, 'isAnonymous'),
    check(type, 'isAny'),
    check(type, 'isArray'),
    check(type, 'isBoolean'),
    check(type, 'isString'),
    check(type, 'isNumber'),
    check(type, 'isClass'),
    check(type, 'isClassOrInterface'),
    check(type, 'isEnum'),
    check(type, 'isInterface'),
    check(type, 'isLiteral'),
    check(type, 'isBooleanLiteral'),
    check(type, 'isStringLiteral'),
    check(type, 'isNumberLiteral'),
    check(type, 'isEnumLiteral'),
    check(type, 'isObject'),
    check(type, 'isTuple'),
    check(type, 'isUnion'),
    check(type, 'isIntersection'),
    check(type, 'isUnionOrIntersection'),
    check(type, 'isUnknown'),
    check(type, 'isNull'),
    check(type, 'isUndefined')
  );
}

function check(type: Type<ts.Type>, method: keyof Type<ts.Type>) {
  const result = (type[method] as () => unknown)();
  if (result) {
    return `${method}: ${result}\n`;
  }
  return '';
}

export function toPrint(value: unknown) {
  if (typeof value === 'object') {
    return {...value, _context: undefined};
  } else {
    return value;
  }
}

export function getTypeText(type: Type<ts.Type>) {
  return type.getText(undefined, ts.TypeFormatFlags.None);
}
