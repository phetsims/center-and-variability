// Copyright 2022-2023, University of Colorado Boulder

/**
 * VariabilityScreenView is the ScreenView for the 'Variability' screen, which has four different scenes with four different
 * distributions.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import CAVColors from '../../common/CAVColors.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { AlignGroup, ManualConstraint, VBox } from '../../../../scenery/js/imports.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';
import VariabilityMeasureRadioButtonGroup from './VariabilityMeasureRadioButtonGroup.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import VariabilityAccordionBox from './VariabilityAccordionBox.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import CAVConstants from '../../common/CAVConstants.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import SoccerPlayer from '../../common/model/SoccerPlayer.js';
import SoccerPlayerNode, { SoccerPlayerImageSet } from '../../common/view/SoccerPlayerNode.js';
import CAVSceneModel from '../../common/model/CAVSceneModel.js';
import InfoDialog from './InfoDialog.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PredictionSlider from '../../common/view/PredictionSlider.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import IntervalToolPlayAreaNode from './IntervalToolPlayAreaNode.js';

type SelfOptions = EmptySelfOptions;
type VariabilityScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class VariabilityScreenView extends CAVScreenView {

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const options = optionize<VariabilityScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      }
    }, providedOptions );

    const variabilityMeasureRadioButtonGroup = new VariabilityMeasureRadioButtonGroup( model.selectedVariabilityMeasureProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'variabilityMeasureRadioButtonGroup' )
    } );

    super( model, options );

    const predictionSliderOptions = {
      predictionThumbNodeOptions: {
        color: CAVColors.intervalToolIconShadedSphereMainColorProperty,
        style: 'line' as const
      },

      enabledRangeProperty: new Property<Range>( CAVConstants.PHYSICAL_RANGE ),
      roundToInterval: null, // continuous
      visibleProperty: model.isIntervalToolVisibleProperty
    };

    this.contentLayer.addChild( new PredictionSlider( model.intervalTool1ValueProperty, this.modelViewTransform, CAVConstants.VARIABILITY_DRAG_RANGE, {
      ...predictionSliderOptions,
      valueProperty: model.intervalTool1ValueProperty,
      tandem: options.tandem.createTandem( 'variabilityIntervalPredictionTool1ValueNode' )
    } ) );

    this.contentLayer.addChild( new PredictionSlider( model.intervalTool2ValueProperty, this.modelViewTransform, CAVConstants.VARIABILITY_DRAG_RANGE, {
      ...predictionSliderOptions,
      valueProperty: model.intervalTool2ValueProperty,
      tandem: options.tandem.createTandem( 'variabilityIntervalPredictionTool2ValueNode' )
    } ) );

    const variabilityAccordionBox = new VariabilityAccordionBox( model, this.layoutBounds, options.tandem.createTandem( 'accordionBox' ), this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN );
    this.setAccordionBox( variabilityAccordionBox );

    ManualConstraint.create( this, [ variabilityAccordionBox.plotToggleNode, this.playAreaNumberLineNode ], ( plotNode, playAreaNumberLineNode ) => {
      plotNode.left = playAreaNumberLineNode.left;
    } );

    ManualConstraint.create( this, [ variabilityMeasureRadioButtonGroup, this.accordionBox! ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.top = accordionBoxWrapper.top + 8;
      } );

    const intervalToolPlayAreaNode = new IntervalToolPlayAreaNode( model.intervalTool1ValueProperty, model.intervalTool2ValueProperty, this.modelViewTransform,
      new DerivedProperty( [ variabilityAccordionBox.boundsProperty ], bounds => bounds.top ), {
        visibleProperty: model.isIntervalToolVisibleProperty,
        tandem: options.tandem.createTandem( 'intervalToolPlayAreaNode' )
      } );
    this.intervalToolLayer.addChild( intervalToolPlayAreaNode );

    const sceneRadioButtonGroup = new SceneRadioButtonGroup( model.variabilitySceneModels, model.selectedSceneModelProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'sceneRadioButtonGroup' )
    } );

    // Float above the ground
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, sceneRadioButtonGroup ],
      ( lowerNumberLineWrapper, sceneRadioButtonGroupWrapper ) => {
        sceneRadioButtonGroupWrapper.bottom = lowerNumberLineWrapper.top - 10;
      } );

    this.addChild( sceneRadioButtonGroup );
    this.addChild( variabilityMeasureRadioButtonGroup );

    const iconGroup = new AlignGroup();

    this.setBottomControls( new VBox( {
      spacing: 15,
      children: [
        new VerticalCheckboxGroup( [
          PlayAreaCheckboxFactory.getMedianCheckboxItem( iconGroup, model ),
          PlayAreaCheckboxFactory.getMeanCheckboxItem( iconGroup, model ),
          PlayAreaCheckboxFactory.getIntervalToolCheckboxItem( iconGroup, model )
        ], {
          tandem: this.tandem.createTandem( 'bottomCheckboxGroup' )
        } )
      ]
    } ) );

    model.variabilitySceneModels.forEach( ( sceneModel, index ) => {

      // The infoDialog only exists in the VariabilityScreen, so having CAVScreenView be in charge of creating custom subclasses
      // of CAVSceneView is overcomplicated and unnecessary. Instead, we create an equivalent tandem, so that it will appear
      // under the appropriate sceneView in the studio tree.
      const infoDialog = new InfoDialog( model, sceneModel, {
        tandem: options.tandem.createTandem( `${CAVConstants.SCENE_VIEW_TANDEM}${index + 1}` ).createTandem( 'infoDialog' )
      } );

      Multilink.multilink( [ model.isInfoVisibleProperty, sceneModel.isVisibleProperty ],
        ( isInfoShowing, isVisible ) => {
          if ( isInfoShowing && isVisible ) {
            infoDialog.show();
          }
          else {
            infoDialog.hide();
          }
        } );
    } );
  }

  public override getSoccerPlayerImageSet( soccerPlayer: SoccerPlayer, sceneModel: CAVSceneModel ): SoccerPlayerImageSet {
    const index = this.model.sceneModels.indexOf( sceneModel );
    return SoccerPlayerNode.VARIABILITY_GROUP[ index ];
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );