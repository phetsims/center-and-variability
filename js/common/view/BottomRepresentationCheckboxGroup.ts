// Copyright 2022-2023, University of Colorado Boulder

/**
 * Supports any combination of checkboxes for each of the screens for the bottom objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import { AlignGroup, GridBox, Node, TColor, Text } from '../../../../scenery/js/imports.js';
import CAVModel from '../model/CAVModel.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../CAVColors.js';
import NumberLineNode from './NumberLineNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PredictionThumbNode from './PredictionThumbNode.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';

type SelfOptions = {
  includeMedian?: boolean;
  includeMean?: boolean;
  includePredictMean?: boolean;
  includePredictMedian?: boolean;
  includeVariability?: boolean;
};
export type BottomRepresentationCheckboxGroupOptions = SelfOptions & VerticalCheckboxGroupOptions &
  PickRequired<VerticalCheckboxGroupOptions, 'tandem'>;

// constants
const TEXT_OPTIONS = {
  font: CAVConstants.BUTTON_FONT,
  maxWidth: CAVConstants.TOP_CHECKBOX_TEXT_MAX_WIDTH
};

export default class BottomRepresentationCheckboxGroup extends VerticalCheckboxGroup {

  public constructor( model: CAVModel, providedOptions?: BottomRepresentationCheckboxGroupOptions ) {

    const options = optionize<BottomRepresentationCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {
      includeMean: true,
      includeMedian: true,
      includePredictMean: true,
      includePredictMedian: true,
      includeVariability: false
    }, providedOptions );

    const items: VerticalCheckboxGroupItem[] = [];
    const iconGroup = new AlignGroup();

    const newGridBox = ( text: Node, icon: Node ) => {
      return new GridBox( {
        stretch: true,
        spacing: 5,
        grow: 1,
        rows: [ [

          // TODO: this will be odd to a11y because both buttons have the same text.  Do we have alt text for the icons?  Or maybe we need alt text for the entire checkbox?
          new Node( { children: [ text ], layoutOptions: { xAlign: 'left' } } ),
          iconGroup.createBox( icon, { layoutOptions: { xAlign: 'right' }, xAlign: 'center' } )
        ] ]
      } );
    };

    const createPredictionItem = ( property: Property<boolean>, stringProperty: LinkableProperty<string>, color: TColor, spacing: number,
                                   tandemName: string ) => {
      return {
        createNode: ( tandem: Tandem ) => newGridBox( new Text( stringProperty, TEXT_OPTIONS ), new PredictionThumbNode( { color: color, maxHeight: 20, pickable: false } ) ),
        property: property,
        tandemName: tandemName
      };
    };

    options.includePredictMedian && items.push( createPredictionItem( model.isShowingMedianPredictionProperty,
      CenterAndVariabilityStrings.predictMedianStringProperty, CAVColors.medianColorProperty, 8, 'predictMedianCheckbox'
    ) );
    options.includePredictMean && items.push( createPredictionItem( model.isShowingMeanPredictionProperty,
      CenterAndVariabilityStrings.predictMeanStringProperty, CAVColors.meanColorProperty, 20.3, 'predictMeanCheckbox'
    ) );

    options.includeVariability && items.push( {
      createNode: ( tandem: Tandem ) => newGridBox( new Text( CenterAndVariabilityStrings.variabilityStringProperty, TEXT_OPTIONS ),
        NumberLineNode.createMeanIndicatorNode( true, true ) ),
      property: model.isShowingPlayAreaVariabilityProperty,
      tandemName: 'variabilityCheckbox'
    } );

    options.includeMedian && items.push( {
      createNode: ( tandem: Tandem ) => newGridBox( new Text( CenterAndVariabilityStrings.medianStringProperty, TEXT_OPTIONS ),
        new ArrowNode( 0, 0, 0, 27, {
          fill: CAVColors.medianColorProperty,
          stroke: CAVColors.arrowStrokeProperty,
          lineWidth: CAVConstants.ARROW_LINE_WIDTH,
          headHeight: 12,
          headWidth: 18,
          maxHeight: 20
        } ) ),
      property: model.isShowingPlayAreaMedianProperty,
      tandemName: 'medianCheckbox'
    } );

    options.includeMean && items.push( {
      createNode: ( tandem: Tandem ) => newGridBox( new Text( CenterAndVariabilityStrings.meanStringProperty, TEXT_OPTIONS ),
        NumberLineNode.createMeanIndicatorNode( true, true ) ),
      property: model.isShowingPlayAreaMeanProperty,
      tandemName: 'meanCheckbox'
    } );

    super( items, options );
  }
}

centerAndVariability.register( 'BottomRepresentationCheckboxGroup', BottomRepresentationCheckboxGroup );