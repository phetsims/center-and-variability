// Copyright 2022-2023, University of Colorado Boulder

/**
 * Screen View for the "Median" and "Mean and Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import centerAndVariability from '../../centerAndVariability.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import CardNodeContainer from '../../common/view/CardNodeContainer.js';
import SoccerModel from '../model/SoccerModel.js';
import ValueReadoutsNode from './ValueReadoutsNode.js';
import { ManualConstraint, Node, Text } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VariabilityModel from '../../variability/model/VariabilityModel.js';
import CAVPlotNodeWithMedianBar from '../../mean-and-median/view/CAVPlotNodeWithMedianBar.js';
import VariabilityPlotNode from '../../variability/view/VariabilityPlotNode.js';
import VariabilityReadoutsNode from '../../variability/view/VariabilityReadoutsNode.js';
import MedianModel from '../../median/model/MedianModel.js';

type SelfOptions = {

  // TODO: If we are sticking with this pattern, switch to screen: 'median' | 'meanAndMedian' | 'variability' etc, see https://github.com/phetsims/center-and-variability/issues/153
  isMedianScreen: boolean;
  isVariabilityScreen: boolean;
  accordionBoxTitleStringProperty: TReadOnlyProperty<string>;
};
export type MeanOrMedianScreenViewOptions = SelfOptions & SoccerScreenViewOptions;

export default class MeanOrMedianScreenView extends SoccerScreenView {
  private readonly accordionBox: CAVAccordionBox;
  protected readonly accordionBoxContents: Node;

  public constructor( model: SoccerModel, providedOptions: MeanOrMedianScreenViewOptions ) {

    const options = optionize<MeanOrMedianScreenViewOptions, EmptySelfOptions, SoccerScreenViewOptions>()( {}, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'accordionBox' );

    // TODO: Better logic for this, or better ordering
    if ( options.isMedianScreen ) {
      this.accordionBoxContents = new CardNodeContainer( this.model as MedianModel, {

        // Expose this intermediate layer to make it so that clients can hide the number cards with one call
        tandem: accordionBoxTandem.createTandem( 'cardNodeContainer' )
      } );
    }
    else if ( options.isVariabilityScreen ) {
      this.accordionBoxContents = new VariabilityPlotNode( this.model as VariabilityModel, this.chartViewWidth, {
        tandem: accordionBoxTandem.createTandem( 'plotNode' )
      } );
    }
    else {
      this.accordionBoxContents = new CAVPlotNodeWithMedianBar( this.model, this.chartViewWidth, {
        tandem: accordionBoxTandem.createTandem( 'plotNode' )
      } );
    }

    const titleNode = new Text( options.accordionBoxTitleStringProperty, {
      font: new PhetFont( 16 ),
      maxWidth: 300
    } );

    this.accordionBox = new CAVAccordionBox( this.model, this.accordionBoxContents, this.accordionBoxControlNode,
      titleNode,
      this.layoutBounds, {
        leftMargin: options.isVariabilityScreen ? 70 : 0,
        tandem: accordionBoxTandem,
        contentNodeOffsetY: options.isMedianScreen ? -6 : 0,
        top: this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN,

        // TODO: Better pattern for this
        valueReadoutsNode: model instanceof VariabilityModel ? new VariabilityReadoutsNode( model ) :
                           options.isMedianScreen ? null :
                           new ValueReadoutsNode( model ),

        ...( options.isVariabilityScreen ? {
          right: this.layoutBounds.right - CAVConstants.SCREEN_VIEW_X_MARGIN
        } : {
          centerX: this.layoutBounds.centerX
        } ),
        infoShowingProperty: this.model instanceof VariabilityModel ? this.model.isInfoShowingProperty : null
      } );
    this.contentLayer.addChild( this.accordionBox );


    // TODO: What if positioning the bottomCheckboxGroup.right forces the topCheckboxGroup to the right of the accordion box bounds?
    ManualConstraint.create( this, [ this.bottomCheckboxGroup, this.accordionBoxControlNode ],
      ( bottomCheckboxGroupWrapper, accordionBoxControlNodeWrapper ) => {
        accordionBoxControlNodeWrapper.x = bottomCheckboxGroupWrapper.x;
      } );

    // Add in the same order as the checkboxes, so the z-order matches the checkbox order
    if ( !options.isMedianScreen ) {
      this.contentLayer.addChild( this.meanPredictionNode );
    }

    this.contentLayer.addChild( this.medianPredictionNode );
  }

  /**
   * Floating layout that keeps the ground near the ground, and accordion box near the question bar
   */
  public override layout( viewBounds: Bounds2 ): void {

    // TODO: Duplicates effort with the parent implementation
    this.matrix = ScreenView.getLayoutMatrix( this.layoutBounds, viewBounds, {
      verticalAlign: 'bottom'
    } );
    this.visibleBoundsProperty.value = this.parentToLocalBounds( viewBounds );

    this.accordionBox.top = this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN;
  }
}

centerAndVariability.register( 'MeanOrMedianScreenView', MeanOrMedianScreenView );