import {ClassDiagramDTO} from '../../../common/src';
import {BaseViewModel} from '../common/BaseViewModel';

export interface DiagramAppViewModel extends BaseViewModel {
  diagram?: ClassDiagramDTO;
  onRefreshClick(): void;
}
