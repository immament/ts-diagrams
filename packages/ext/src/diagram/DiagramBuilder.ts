import {ClassDiagramExtractor, DiagramStream} from 'extractor';

export interface DiagramBuilder {
  create(opt: {diagramSrc?: string; files?: string}): DiagramStream;
}

export class DiagramBuilderImpl implements DiagramBuilder {
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

    const diagramStream = diagramExtractor.extract({directory: diagramSrc});

    return diagramStream;
  }
}
