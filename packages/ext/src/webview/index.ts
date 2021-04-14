import {serviceContainer} from 'common';
import {VscodeDiagramDataSourceImpl} from './VscodeDiagramDataSource';

serviceContainer.set('DiagramDataSource', new VscodeDiagramDataSourceImpl());
