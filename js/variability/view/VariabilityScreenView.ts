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
import BottomRepresentationCheckboxGroup from '../../common/view/BottomRepresentationCheckboxGroup.js';
import CAVConstants from '../../common/CAVConstants.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import MaxKicksControlNode from '../../common/view/MaxKicksControlNode.js';
import SoccerPlayer from '../../common/model/SoccerPlayer.js';
import SoccerPlayerNode, { SoccerPlayerImageSet } from '../../common/view/SoccerPlayerNode.js';
import CAVSceneModel from '../../common/model/CAVSceneModel.js';
import InfoDialog from './InfoDialog.js';
import Multilink from '../../../../axon/js/Multilink.js';

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

    const variabilityMeasureRadioButtonGroup = new VariabilityMeasureRadioButtonGroup( model.selectedVariabilityProperty, {
      left: 10,
      tandem: options.tandem.createTandem( 'variabilityMeasureRadioButtonGroup' )
    } );

    super( model, options );

    const variabilityAccordionBox = new VariabilityAccordionBox( model, this.layoutBounds, options.tandem.createTandem( 'accordionBox' ), this.questionBar.bottom + CAVConstants.SCREEN_VIEW_Y_MARGIN );
    this.setAccordionBox( variabilityAccordionBox );
    variabilityAccordionBox.alignWithPlayAreaNumberLineNode( this.playAreaNumberLineNode.globalBounds.x );

    ManualConstraint.create( this, [ variabilityMeasureRadioButtonGroup, this.accordionBox! ],
      ( variabilityRadioButtonGroupWrapper, accordionBoxWrapper ) => {
        variabilityRadioButtonGroupWrapper.centerY = accordionBoxWrapper.centerY;
      } );

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
          BottomRepresentationCheckboxGroup.getVariabilityCheckboxItem( iconGroup, model ),
          BottomRepresentationCheckboxGroup.getMedianCheckboxItem( iconGroup, model ),
          BottomRepresentationCheckboxGroup.getMeanCheckboxItem( iconGroup, model )
        ], {
          tandem: this.tandem.createTandem( 'bottomCheckboxGroup' )
        } ),
        new MaxKicksControlNode( model.maxKicksProperty, this, {
          tandem: this.tandem.createTandem( 'maxKicksControlNode' )
        } )
      ]
    } ) );

    model.variabilitySceneModels.forEach( ( sceneModel, index ) => {

      // TODO: https://github.com/phetsims/center-and-variability/issues/164 Do we really want to create 12 of these?
      const infoDialog = new InfoDialog( model, sceneModel, {
        tandem: options.tandem.createTandem( 'scene' + index ).createTandem( 'infoDialog' )
      } );

      Multilink.multilink( [ model.isInfoShowingProperty, sceneModel.isVisibleProperty ],
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