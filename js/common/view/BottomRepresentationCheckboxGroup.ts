// Copyright 2022, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens for the bottom objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndSpread from '../../centerAndSpread.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { Text, HBox } from '../../../../scenery/js/imports.js';
import CASModel from '../model/CASModel.js';
import CASConstants from '../CASConstants.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import PredictionNode from './PredictionNode.js';

type BottomRepresentationCheckboxGroupSelfOptions = {
  includeMedian?: boolean;
  includeMean?: boolean;
  includePredictMean?: boolean;
  includePredictMedian?: boolean;
};
export type BottomRepresentationCheckboxGroupOptions =
  BottomRepresentationCheckboxGroupSelfOptions
  & VerticalCheckboxGroupOptions;

// constants
const TEXT_OPTIONS = {
  font: CASConstants.BUTTON_FONT
};

// TODO: VerticalCheckboxGroup should be TypeScript
class BottomRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  constructor( model: CASModel, providedOptions?: BottomRepresentationCheckboxGroupOptions ) {

    const options = optionize<BottomRepresentationCheckboxGroupOptions, BottomRepresentationCheckboxGroupSelfOptions, VerticalCheckboxGroupOptions>( {
      includeMean: true,
      includeMedian: true,
      includePredictMean: true,
      includePredictMedian: true
    }, providedOptions );

    const items = [];
    options.includeMean && items.push( {
      node: new Text( centerAndSpreadStrings.mean, TEXT_OPTIONS ),
      property: model.isShowingBottomMeanProperty
    } );
    options.includeMedian && items.push( {

      // TODO: Align group to center align the icons
      node: new HBox( {
        spacing: 17,
        children: [
          new Text( centerAndSpreadStrings.median, TEXT_OPTIONS ),

          // TODO: Factor out?
          new ArrowNode( 0, 0, 0, 35, { fill: 'red', stroke: null, maxHeight: 20 } ) ]
      } ),
      property: model.isShowingBottomMedianProperty
    } );
    options.includePredictMean && items.push( {
      node: new Text( centerAndSpreadStrings.predict, TEXT_OPTIONS ),
      property: model.isShowingMeanPredictionProperty
    } );
    options.includePredictMedian && items.push( {
      node: new HBox( {
        spacing: 20,
        children: [
          new Text( centerAndSpreadStrings.predict, TEXT_OPTIONS ),
          new PredictionNode( new Property<number>( 1 ), ModelViewTransform2.createIdentity(), new Range( 1, 16 ), {
            pickable: false,
            maxHeight: 20,
            tandem: Tandem.OPT_OUT
          } )
        ]
      } ),
      property: model.isShowingMedianPredictionProperty
    } );
    super( items, options );
  }
}

centerAndSpread.register( 'BottomRepresentationCheckboxGroup', BottomRepresentationCheckboxGroup );
export default BottomRepresentationCheckboxGroup;