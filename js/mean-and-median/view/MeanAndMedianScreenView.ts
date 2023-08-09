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
import Range from '../../../../dot/js/Range.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import MeanAndMedianAccordionBox from './MeanAndMedianAccordionBox.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import CAVConstants from '../../common/CAVConstants.js';
import PredictionSlider from '../../common/view/PredictionSlider.js';
import Property from '../../../../axon/js/Property.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import MeanAndMedianInfoDialog from './MeanAndMedianInfoDialog.js';

type SelfOptions = EmptySelfOptions;
type MeanAndMedianScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class MeanAndMedianScreenView extends CAVScreenView {

  public constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.meanAndMedianQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.meanAndMedianQuestionStringProperty
      }
    }, providedOptions );

    super( model, options );

    const accordionBoxTandem = options.tandem.createTandem( 'plotAccordionBox' );

    const meanAndMedianAccordionBox = new MeanAndMedianAccordionBox(
      model,
      this.layoutBounds,
      accordionBoxTandem,
      this.questionBar.bottom + CAVConstants.ACCORDION_BOX_TOP_MARGIN,
      this.playAreaNumberLineNode
    );
    this.setAccordionBox( meanAndMedianAccordionBox );

    const controls = this.addPlayAreaControls( new VerticalCheckboxGroup( [
      PlayAreaCheckboxFactory.getPredictMedianCheckboxItem( model ),
      PlayAreaCheckboxFactory.getPredictMeanCheckboxItem( model ),
      PlayAreaCheckboxFactory.getMedianCheckboxItem( model ),
      PlayAreaCheckboxFactory.getMeanCheckboxItem( model )
    ], {
      tandem: this.playAreaTandem.createTandem( 'checkboxGroup' )
    } ), this.playAreaTandem );

    const predictMeanTandem = this.playAreaTandem.createTandem( 'predictMeanNode' );
    const predictMeanNode = new PredictionSlider( model.predictMeanValueProperty, this.modelViewTransform,
      CAVConstants.PHYSICAL_RANGE, {
        predictionThumbNodeOptions: {
          color: CAVColors.meanColorProperty,
          style: 'arrow'
        },
        valueProperty: model.predictMeanValueProperty,
        enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
        roundToInterval: null, // continuous
        visibleProperty: model.isPredictMeanVisibleProperty,
        tandem: predictMeanTandem
      } );

    this.backScreenViewLayer.addChild( predictMeanNode );

    const predictMedianNode = CAVScreenView.createPredictMedianNode(
      model,
      this.modelViewTransform,
      this.playAreaTandem.createTandem( 'predictMedianNode' )
    );
    this.backScreenViewLayer.addChild( predictMedianNode );

    const infoDialog = new MeanAndMedianInfoDialog( model, model.sceneModels[ 0 ], this.playAreaNumberLineNode, {
      tandem: accordionBoxTandem.createTandem( 'infoDialog' )
    } );

    model.infoButtonPressedEmitter.addListener( () => infoDialog.show() );

    this.cavSetPDOMOrder( controls, [ predictMedianNode, predictMeanNode ], meanAndMedianAccordionBox.infoButton );
  }
}

centerAndVariability.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );