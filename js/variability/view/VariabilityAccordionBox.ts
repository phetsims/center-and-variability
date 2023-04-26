// Copyright 2023, University of Colorado Boulder

import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import { Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import VariabilityReadoutsNode from './VariabilityReadoutsNode.js';
import CAVConstants from '../../common/CAVConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';

// TODO: Copied from somewhere. What's the best pattern?
const TEXT_OPTIONS = {
  font: CAVConstants.BUTTON_FONT,
  maxWidth: CAVConstants.PLAY_AREA_CHECKBOX_TEXT_MAX_WIDTH
};

export default class VariabilityAccordionBox extends CAVAccordionBox {

  public constructor( model: VariabilityModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    const currentProperty = new DerivedProperty( [ model.selectedVariabilityProperty ], selectedVariability =>
      selectedVariability === VariabilityMeasure.RANGE ? CenterAndVariabilityStrings.rangeStringProperty :
      selectedVariability === VariabilityMeasure.IQR ? CenterAndVariabilityStrings.interquartileRangeIQRStringProperty :
      CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty
    );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    const accordionBoxContents = new VariabilityPlotNode( model, {
      tandem: tandem.createTandem( 'plotNode' )
    } );

    const infoButton = new InfoButton( {
      iconFill: 'cornflowerblue',
      scale: 0.5,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'infoButton' ),
      listener: () => {
        model.isInfoShowingProperty.value = true;
      },

      // TODO: How to position this properly?
      top: 10,
      right: accordionBoxContents.width + 130
    } );
    accordionBoxContents.addChild( infoButton );

    super( model, accordionBoxContents, new ToggleNode( model.selectedVariabilityProperty, [ {
        value: VariabilityMeasure.RANGE,

        // TODO: Different string value? For now, use the same string for the accordion box title and checkbox, and a different one for the value equals pattern
        createNode: tandem => new Checkbox( model.isShowingRangeProperty, new Text( CenterAndVariabilityStrings.rangeStringProperty, TEXT_OPTIONS ), {
          tandem: tandem.createTandem( 'rangeCheckbox' )
        } )
      }, {
        value: VariabilityMeasure.IQR,
        createNode: tandem => new Checkbox( model.isShowingIQRProperty, new Text( CenterAndVariabilityStrings.iqrStringProperty, TEXT_OPTIONS ), {
          tandem: tandem.createTandem( 'iqrCheckbox' )
        } )
      }, {
        value: VariabilityMeasure.MAD,
        createNode: tandem => new Checkbox( model.isShowingMADProperty, new Text( CenterAndVariabilityStrings.madStringProperty, TEXT_OPTIONS ), {
          tandem: tandem.createTandem( 'madCheckbox' )
        } )
      }
      ] ),
      new Text( accordionBoxTitleProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      layoutBounds, {
        leftMargin: 70,
        tandem: tandem,
        top: top,
        valueReadoutsNode: new VariabilityReadoutsNode( model ),
        right: layoutBounds.right - CAVConstants.SCREEN_VIEW_X_MARGIN
      } );
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );