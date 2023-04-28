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
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import CAVConstants from '../../common/CAVConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';

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

      // TODO: How to position this properly? Can we use AlignBox?
      top: 20,
      right: accordionBoxContents.width + 10
    } );
    accordionBoxContents.addChild( infoButton );

    super( model, accordionBoxContents,
      new Text( accordionBoxTitleProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      layoutBounds, {
        leftMargin: 70,
        tandem: tandem,
        top: top,
        right: layoutBounds.right - CAVConstants.SCREEN_VIEW_X_MARGIN
      } );
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );