// Copyright 2022-2023, University of Colorado Boulder

/**
 * ScreenView for the "Mean and Median" Screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { ManualConstraint, Text, Node } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CAVPlotNodeWithMedianBar from './CAVPlotNodeWithMedianBar.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import ValueReadoutsNode from '../../common/view/ValueReadoutsNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TopRepresentationCheckboxGroup from '../../common/view/TopRepresentationCheckboxGroup.js';

type MeanAndMedianScreenViewOptions = StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MeanAndMedianScreenView extends CAVScreenView {

  public constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions, EmptySelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.meanAndMedianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.meanAndMedianQuestionStringProperty
      }
    }, providedOptions );

    // TODO: Improve this pattern?
    let afterInit: ( () => void ) | null = null;

    super( model, ( tandem: Tandem, top: number, layoutBounds: Bounds2, playAreaNumberLineNode: Node ) => {

      const accordionBoxContents = new CAVPlotNodeWithMedianBar( model,

        // TODO: it's a constant, should not be a parameter
        CAVConstants.CHART_VIEW_WIDTH, {
          tandem: tandem.createTandem( 'plotNode' )
        } );

      afterInit = () => {
        // NOTE: This assumes that the NumberLineNode in the play area and in the dot plot have the same characteristics:
        // * Same font
        // * Same offset and scale
        // But given those assumptions, this code moves the dot plot so that its number line matches the play area one.
        // TODO: Consider something more robust.  Using globalToLocal to exactly align based on the position of the tick marks
        ManualConstraint.create( this, [ playAreaNumberLineNode, accordionBoxContents ],
          ( lowerNumberLineWrapper, contentsWrapper ) => {
            contentsWrapper.x = lowerNumberLineWrapper.x;
          } );
      };

      return new CAVAccordionBox( model, accordionBoxContents, new TopRepresentationCheckboxGroup( model, {
          medianBarIconOptions: {
            notchDirection: 'down',
            barStyle: 'continuous',
            arrowScale: 0.75
          },
          showMedianCheckboxIcon: true,
          tandem: tandem.createTandem( 'topRepresentationCheckboxGroup' )
        } ),
        new Text( CenterAndVariabilityStrings.distanceInMetersStringProperty, {
          font: new PhetFont( 16 ),
          maxWidth: 300
        } ),
        layoutBounds, {
          leftMargin: 0,
          tandem: tandem,
          contentNodeOffsetY: 0,
          top: top,
          valueReadoutsNode: new ValueReadoutsNode( model ),
          centerX: layoutBounds.centerX
        } );
    }, options );

    afterInit!();
  }
}

centerAndVariability.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );