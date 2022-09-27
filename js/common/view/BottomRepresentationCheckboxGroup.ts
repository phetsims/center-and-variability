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
import centerAndVariability from '../../centerAndVariability.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { HBox, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVModel from '../model/CAVModel.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PredictionNode from './PredictionNode.js';
import CAVColors from '../CAVColors.js';
import NumberLineNode from './NumberLineNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  includeMedian?: boolean;
  includeMean?: boolean;
  includePredictMean?: boolean;
  includePredictMedian?: boolean;
};
export type BottomRepresentationCheckboxGroupOptions = SelfOptions & VerticalCheckboxGroupOptions &
  PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

// constants
const TEXT_OPTIONS = {
  font: CAVConstants.BUTTON_FONT,
  maxWidth: CAVConstants.TOP_CHECKBOX_TEXT_MAX_WIDTH
};

class BottomRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  public constructor( model: CAVModel, providedOptions?: BottomRepresentationCheckboxGroupOptions ) {

    const options = optionize<BottomRepresentationCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {
      includeMean: true,
      includeMedian: true,
      includePredictMean: true,
      includePredictMedian: true
    }, providedOptions );

    const items: VerticalCheckboxGroupItem[] = [];

    const createPredictionItem = ( property: Property<boolean>, string: string, color: TColor, spacing: number,
                                   tandemName: string ) => {
      return {
        createNode: ( tandem: Tandem ) => new HBox( {
          spacing: spacing,
          children: [

            // TODO: this will be odd to a11y because both buttons have the same text.  Do we have alt text for the icons?  Or maybe we need alt text for the entire checkbox?
            new Text( string, TEXT_OPTIONS ),
            new PredictionNode( new Property<number>( 1 ), ModelViewTransform2.createIdentity(), new Range( 1, 16 ), {
              pickable: false,
              maxHeight: 20,
              tandem: Tandem.OPT_OUT,
              color: color,
              roundToInterval: null
            } )
          ]
        } ),
        property: property,
        tandemName: tandemName
      };
    };

    options.includePredictMean && items.push( createPredictionItem( model.isShowingMeanPredictionProperty,
      CenterAndVariabilityStrings.predictMean, CAVColors.meanColorProperty, 20.3, 'predictMeanCheckbox'
    ) );
    options.includePredictMedian && items.push( createPredictionItem( model.isShowingMedianPredictionProperty,
      CenterAndVariabilityStrings.predictMedian, CAVColors.medianColorProperty, 8, 'predictMedianCheckbox'
    ) );

    options.includeMean && items.push( {

      // TODO: Align group to center align the icons
      createNode: ( tandem: Tandem ) => new HBox( {
        spacing: 24.5,
        children: [
          new Text( CenterAndVariabilityStrings.mean, TEXT_OPTIONS ),
          NumberLineNode.createMeanIndicatorNode( true )
        ]
      } ),
      property: model.isShowingPlayAreaMeanProperty,
      tandemName: 'meanCheckbox'
    } );
    options.includeMedian && items.push( {

      // TODO: Align group to center align the icons
      createNode: ( tandem: Tandem ) => new HBox( {
        spacing: 14,
        children: [
          new Text( CenterAndVariabilityStrings.median, TEXT_OPTIONS ),

          // TODO: Factor out?  See playAreaMedianIndicatorNode
          new ArrowNode( 0, 0, 0, 27, {
            fill: CAVColors.medianColorProperty,
            stroke: CAVColors.arrowStrokeProperty,
            lineWidth: CAVConstants.ARROW_LINE_WIDTH,
            headHeight: 12,
            headWidth: 18,
            maxHeight: 20
          } )
        ]
      } ),
      property: model.isShowingPlayAreaMedianProperty,
      tandemName: 'medianCheckbox'
    } );

    super( items, options );
  }
}

centerAndVariability.register( 'BottomRepresentationCheckboxGroup', BottomRepresentationCheckboxGroup );
export default BottomRepresentationCheckboxGroup;