// Copyright 2022-2025, University of Colorado Boulder

/**
 * VariabilityScreenView is the ScreenView for the 'Variability' screen, which has four different scenes with
 * four different distributions.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../../common/CAVColors.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVScreenView, { CAVScreenViewOptions } from '../../common/view/CAVScreenView.js';
import PlayAreaCheckboxFactory from '../../common/view/PlayAreaCheckboxFactory.js';
import PredictionSlider from '../../common/view/PredictionSlider.js';
import VariabilityModel from '../model/VariabilityModel.js';
import IntervalToolNode from './IntervalToolNode.js';
import SceneKickerRadioButtonGroup from './SceneKickerRadioButtonGroup.js';
import VariabilityAccordionBox from './VariabilityAccordionBox.js';
import VariabilityInfoDialog from './VariabilityInfoDialog.js';
import VariabilityMeasureRadioButtonGroup from './VariabilityMeasureRadioButtonGroup.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VariabilityScreenSummaryContent from './VariabilityScreenSummaryContent.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';

type SelfOptions = EmptySelfOptions;
type VariabilityScreenViewOptions = SelfOptions & StrictOmit<CAVScreenViewOptions, 'questionBarOptions'>;

export default class VariabilityScreenView extends CAVScreenView<VariabilitySceneModel> {

  //PDOM
  private readonly intervalToolHeading: Node;

  public constructor( model: VariabilityModel, providedOptions: VariabilityScreenViewOptions ) {

    const options = optionize<VariabilityScreenViewOptions, SelfOptions, CAVScreenViewOptions>()( {
      questionBarOptions: {
        barFill: CAVColors.variabilityQuestionBarFillColorProperty,
        questionString: CenterAndVariabilityStrings.variabilityQuestionStringProperty
      },
      screenSummaryContent: new VariabilityScreenSummaryContent( model )
    }, providedOptions );

    const variabilityMeasureRadioButtonGroup = new VariabilityMeasureRadioButtonGroup( model.selectedVariabilityMeasureProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'variabilityMeasureRadioButtonGroup' )
    } );

    super( model, options );
    this.intervalToolHeading = new Node( {
      visibleProperty: model.intervalToolModel.isVisibleProperty,
      accessibleHeading: CenterAndVariabilityFluent.a11y.variabilityScreen.intervalTool.accessibleHeadingStringProperty,
      accessibleParagraph: CenterAndVariabilityFluent.a11y.variabilityScreen.intervalTool.accessibleHelpTextStringProperty
    } );

    const accordionBoxTandem = options.tandem.createTandem( 'variabilityMeasureAccordionBox' );

    const pointerTandem = this.soccerAreaTandem.createTandem( 'pointerNode' );
    const pointerSlider = new PredictionSlider( model.pointerValueProperty, this.modelViewTransform,
      CAVConstants.VARIABILITY_DRAG_RANGE, {
        predictionThumbNodeOptions: {
          color: CAVColors.pointerColorProperty,
          style: 'arrow'
        },
        valueProperty: model.pointerValueProperty,
        enabledRangeProperty: new Property<Range>( CAVConstants.VARIABILITY_DRAG_RANGE ),
        roundToInterval: null, // continuous
        visibleProperty: model.isPointerVisibleProperty,
        accessibleName: CenterAndVariabilityFluent.a11y.variabilityScreen.pointerNode.accessibleNameStringProperty,
        pdomMapPDOMValue: value => roundToInterval( value, 0.1 ),
        tandem: pointerTandem,

        // It is rare to feature a NodeIO, but in this case it is important since the only other featured children
        // are LinkedElementIO, so this makes it appear in the featured tree.
        phetioFeatured: true
      } );

    const variabilityAccordionBox = new VariabilityAccordionBox(
      model,
      model.intervalToolModel,
      accordionBoxTandem,
      this.playAreaNumberLineNode
    );
    this.setAccordionBox( variabilityAccordionBox );

    ManualConstraint.create( this, [ variabilityMeasureRadioButtonGroup, this.accordionBox! ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.top = accordionBoxWrapper.top + 8;
      } );

    const intervalToolNode = new IntervalToolNode( model.intervalToolModel, this.modelViewTransform,
      new DerivedProperty( [ variabilityAccordionBox.boundsProperty ], bounds => bounds.top ),
      options.tandem.createTandem( 'intervalToolNode' ) );

    // To avoid a cycle during startup, we must create the AccordionBox and IntervalToolNode, then propagate the IntervalToolNode
    // through so the one in the accordion box can share the same highlight region as the one in the play area.
    variabilityAccordionBox.setFocusHighlightForIntervalTool( intervalToolNode.rectangle );

    // Add play area tools to scene graph
    // this.backScreenViewLayer.addChild( handle1 );
    // this.backScreenViewLayer.addChild( handle2 );
    this.intervalToolLayer.addChild( intervalToolNode );

    // pointer should always be in front of the interval tool so must be added after.
    this.backScreenViewLayer.addChild( pointerSlider );

    const sceneKickerRadioButtonGroup = new SceneKickerRadioButtonGroup( model.variabilitySceneModels, model.selectedSceneModelProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'sceneKickerRadioButtonGroup' )
    } );

    // Float above the ground
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, sceneKickerRadioButtonGroup ],
      ( lowerNumberLineWrapper, sceneKickerRadioButtonGroupWrapper ) => {
        sceneKickerRadioButtonGroupWrapper.bottom = lowerNumberLineWrapper.top - 10;
      } );

    this.frontScreenViewLayer.addChild( sceneKickerRadioButtonGroup );
    this.frontScreenViewLayer.addChild( variabilityMeasureRadioButtonGroup );

    const controls = this.addPlayAreaControls(
      new VerticalCheckboxGroup( [
        PlayAreaCheckboxFactory.getMedianCheckboxItem( model.isPlayAreaMedianVisibleProperty, model.selectedSceneModelProperty ),
        PlayAreaCheckboxFactory.getMeanCheckboxItem( model.isPlayAreaMeanVisibleProperty, model.selectedSceneModelProperty ),
        PlayAreaCheckboxFactory.getPointerCheckboxItem( model.isPointerVisibleProperty ),
        PlayAreaCheckboxFactory.getIntervalToolCheckboxItem( model.intervalToolModel.isVisibleProperty )
      ], {
        tandem: this.soccerAreaTandem.createTandem( 'checkboxGroup' ),
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      } ), this.soccerAreaTandem );

    model.variabilitySceneModels.forEach( ( sceneModel, index ) => {

      // The VariabilityInfoDialog only exists in the VariabilityScreen, so having CAVScreenView be in charge of creating custom subclasses
      // of CAVSceneView is overcomplicated and unnecessary. Instead, we create an equivalent tandem, so that it will appear
      // under the appropriate sceneView in the studio tree.
      const infoDialog = new VariabilityInfoDialog( model, sceneModel, this.playAreaNumberLineNode,
        options.tandem.createTandem( `sceneKicker${index + 1}View` ).createTandem( 'infoDialog' )
      );

      model.infoButtonPressedEmitter.addListener( () => {
        if ( sceneModel.isVisibleProperty.value ) {
          infoDialog.show();
        }
      } );
    } );
    this.addChild( this.intervalToolHeading );

    this.cavSetPDOMOrder( controls, [ pointerSlider, this.intervalToolHeading, intervalToolNode ], variabilityAccordionBox.infoButton,
      sceneKickerRadioButtonGroup, variabilityMeasureRadioButtonGroup );
  }

  public override step( dt: number ): void {
    super.step( dt );
  }
}

centerAndVariability.register( 'VariabilityScreenView', VariabilityScreenView );