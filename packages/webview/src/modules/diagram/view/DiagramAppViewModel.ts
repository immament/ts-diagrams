/* istanbul ignore file */

import {ClassDiagramDTO} from 'common';
import {BaseViewModel} from '../../../common/BaseViewModel';

export interface DiagramAppViewModel extends BaseViewModel {
  diagram?: ClassDiagramDTO;
}
