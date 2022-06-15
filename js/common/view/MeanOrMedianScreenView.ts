// Copyright 2022, University of Colorado Boulder

/**
 * Screen View for the "Median" and "Mean and Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../common/view/SoccerScreenView.js';
import centerAndVariabilityStrings from '../../centerAndVariabilityStrings.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import CardNodeContainer from '../../common/view/CardNodeContainer.js';
import CAVPlotNode from './CAVPlotNode.js';
import SoccerModel from '../model/SoccerModel.js';
import ValueReadoutsNode from './ValueReadoutsNode.js';
import { Node, ManualConstraint, Text } from '../../../../scenery/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlotType from '../model/PlotType.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {
  isMedianScreen: boolean;
};
export type MeanOrMedianScreenViewOptions = SelfOptions & SoccerScreenViewOptions;

class MeanOrMedianScreenView extends SoccerScreenView {
  private readonly accordionBox: CAVAccordionBox;
  protected readonly accordionBoxContents: Node;

  constructor( model: SoccerModel, providedOptions: MeanOrMedianScreenViewOptions ) {

    const options = optionize<MeanOrMedianScreenViewOptions, EmptyObjectType, SoccerScreenViewOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'accordionBox' );

    if ( options.isMedianScreen ) {
      this.accordionBoxContents = new CardNodeContainer( this.model, {

        // Expose this intermediate layer to make it so that clients can hide the number cards with one call
        tandem: accordionBoxTandem.createTandem( 'cardNodeContainer' )
      } );
    }
    else {
      this.accordionBoxContents = new CAVPlotNode( this.model, this.chartViewWidth, {
        tandem: accordionBoxTandem.createTandem( 'plotNode' )
      } );
    }

    const titleNode = new Text( '', {
      font: new PhetFont( 16 ),
      maxWidth: 300
    } );

    if ( options.isMedianScreen ) {
      titleNode.text = centerAndVariabilityStrings.distanceInMeters;
    }
    else {
      CAVConstants.PLOT_TYPE_PROPERTY.link( plotType => {
        titleNode.text = plotType === PlotType.LINE_PLOT ? centerAndVariabilityStrings.linePlot : centerAndVariabilityStrings.dotPlot;
      } );
    }

    this.accordionBox = new CAVAccordionBox( this.model, this.accordionBoxContents, this.topCheckboxGroup,
      titleNode,
      this.layoutBounds, {
        tandem: accordionBoxTandem,
        contentNodeOffsetY: options.isMedianScreen ? -6 : 0,
        centerX: this.layoutBounds.centerX,
        top: this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN,

        // TODO: Better pattern for this
        valueReadoutsNode: options.isMedianScreen ? null : new ValueReadoutsNode( model )
      } );
    this.contentLayer.addChild( this.accordionBox );

    const BOTTOM_CHECKBOX_PANEL_MARGIN = 12.5;

    // TODO: What if positioning the bottomCheckboxGroup.right forces the topCheckboxGroup to the right of the accordion box bounds?
    this.bottomCheckboxGroup.right = this.layoutBounds.right - BOTTOM_CHECKBOX_PANEL_MARGIN;
    this.bottomCheckboxGroup.bottom = this.modelViewTransform.modelToViewY( 0 ) - BOTTOM_CHECKBOX_PANEL_MARGIN;

    ManualConstraint.create( this, [ this.bottomCheckboxGroup, this.topCheckboxGroup ],
      ( bottomCheckboxGroupWrapper, topCheckboxGroupWrapper ) => {
        topCheckboxGroupWrapper.x = bottomCheckboxGroupWrapper.x;
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
  override layout( viewBounds: Bounds2 ): void {

    // TODO: Duplicates effort with the parent implementation
    this.matrix = ScreenView.getLayoutMatrix( this.layoutBounds, viewBounds, {
      verticalAlign: 'bottom'
    } );
    this.visibleBoundsProperty.value = this.parentToLocalBounds( viewBounds );

    this.accordionBox.top = this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN;
  }
}

centerAndVariability.register( 'MeanOrMedianScreenView', MeanOrMedianScreenView );
export default MeanOrMedianScreenView;