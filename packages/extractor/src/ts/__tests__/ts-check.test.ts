/* eslint-disable node/no-unsupported-features/node-builtins */
import * as path from 'path';
import {Project} from 'ts-morph';
import * as ts from 'typescript';

describe.skip('ts-check', () => {
  test('check ts program', () => {
    console.time('t2');
    const program = ts.createProgram({
      rootNames: [createPath('a.ts'), createPath('aa/b.ts')],
      options: {
        typeRoots: [],
        lib: ['lib.es5.d.ts'],
        //noResolve: true,
        // skipLibCheck: true,
        // skipDefaultLibCheck: true,
      },
    });
    //console.timeLog('t2');

    const diagnostics = program.getGlobalDiagnostics();

    expect(diagnostics.length).toBe(0);
    const sf = program.getSourceFile(createPath('a.ts'));

    const classDeclaration = findClass(sf!);
    expect(classDeclaration).toBeTruthy();
    const typeChecker = program.getTypeChecker();
    expect(typeChecker).toBeTruthy();
    //console.log(prepareToPrintNode((classDeclaration as any).symbol));

    // TODO: why return undefined?
    //const symbol = typeChecker.getSymbolAtLocation(classDeclaration!);
    //expect(symbol).toBeTruthy();

    console.timeEnd('t2');
  });

  test('check ts-morph project', () => {
    console.time('t3');
    const project = new Project({
      compilerOptions: {
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        typeRoots: [],
        lib: ['lib.es2015.d.ts'],
        //noResolve: true,
      },

      //skipLoadingLibFiles: true,
      skipAddingFilesFromTsConfig: true,
    });

    project.addSourceFilesAtPaths(createPath('**/*.ts'));

    expect(project.getProgram().getGlobalDiagnostics().length).toBe(0);

    const sf = project.getSourceFile('b.ts');
    const bClass = sf?.getClass('B');
    expect(bClass).toBeTruthy();
    const bSymbol = bClass?.getSymbol();
    expect(bSymbol).toBeTruthy();

    const sfA = project.getSourceFile('a.ts');
    expect(sfA).toBeTruthy();
    const aClass = sfA?.getClass('A');
    expect(aClass).toBeTruthy();

    expect(aClass?.getExtends()).toBeTruthy();
    expect(aClass?.getExtends()?.getType().getSymbol()).toBe(bSymbol);
    console.timeEnd('t3');
  });

  const testDir = path.join(__dirname, 'test_data');

  function createPath(postfix: string): string {
    return path.join(testDir, postfix);
  }

  function findClass(node: ts.Node): ts.Node | undefined {
    return node.forEachChild(n => {
      return ts.isClassDeclaration(n) ? n : findClass(n);
    });
  }
});
