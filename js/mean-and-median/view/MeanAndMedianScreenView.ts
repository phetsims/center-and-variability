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
import { AlignGroup } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import MeanAndMedianAccordionBox from './MeanAndMedianAccordionBox.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import CAVConstants from '../../common/CAVConstants.js';
import PredictionSlider from '../../common/view/PredictionSlider.js';
import Property from '../../../../axon/js/Property.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';

type MeanAndMedianScreenViewOptions = StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MeanAndMedianScreenView extends CAVScreenView {

  public constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions, EmptySelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.meanAndMedianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.meanAndMedianQuestionStringProperty
      }
    }, providedOptions );

    super( model, options );

    const meanAndMedianAccordionBox = new MeanAndMedianAccordionBox( model, this.layoutBounds, options.tandem.createTandem( 'accordionBox' ), this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN, this.playAreaNumberLineNode );
    this.setAccordionBox( meanAndMedianAccordionBox );
    meanAndMedianAccordionBox.alignWithPlayAreaNumberLineNode( this.playAreaNumberLineNode.globalBounds.x );

    const iconGroup = new AlignGroup();
    this.setBottomControls( new VerticalCheckboxGroup( [
      PlayAreaCheckboxFactory.getPredictMedianCheckboxItem( iconGroup, model ),
      PlayAreaCheckboxFactory.getPredictMeanCheckboxItem( iconGroup, model ),
      PlayAreaCheckboxFactory.getMedianCheckboxItem( iconGroup, model ),
      PlayAreaCheckboxFactory.getMeanCheckboxItem( iconGroup, model )
    ], {
      tandem: this.tandem.createTandem( 'bottomCheckboxGroup' )
    } ) );

    this.contentLayer.addChild( new PredictionSlider( model.meanPredictionProperty, this.modelViewTransform, CAVConstants.PHYSICAL_RANGE, {
      predictionThumbNodeOptions: {
        color: CAVColors.meanColorProperty
      },
      valueProperty: model.meanPredictionProperty,
      enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
      roundToInterval: null, // continuous
      visibleProperty: model.isMeanPredictionVisibleProperty,
      tandem: options.tandem.createTandem( 'meanPredictionNode' )
    } ) );
    this.contentLayer.addChild( CAVScreenView.createMedianPredictionNode(
      model,
      this.modelViewTransform,
      options.tandem.createTandem( 'medianPredictionNode' )
    ) );
  }
}

centerAndVariability.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );