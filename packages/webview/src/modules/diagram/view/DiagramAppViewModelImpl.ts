import {ClassDiagramDTO} from 'common';
import {DiagramAppViewModel} from './DiagramAppViewModel';

export class DiagramAppViewModelIml implements DiagramAppViewModel {
  constructor(public diagram?: ClassDiagramDTO) {}
}
