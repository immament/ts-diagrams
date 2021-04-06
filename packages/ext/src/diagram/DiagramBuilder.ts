import {ClassDiagramDTO} from 'common';
import {ClassDiagramExtractor} from 'extractor';

export interface DiagramBuilder {
  create(opt: {diagramSrc?: string; files?: string}): ClassDiagramDTO;
}

export class DiagramBuilderIml implements DiagramBuilder {
  create({
    diagramSrc,
    files,
  }: {
    diagramSrc?: string;
    files?: string;
  } = {}) {
    const diagramExtractor = new ClassDiagramExtractor(
      {
        skipLoadingLibFiles: true,
      },
      {includeFilesFromDir: diagramSrc, filesPattern: files}
    );

    const diagram = diagramExtractor.extract({directory: diagramSrc});

    return diagram;
  }
}
