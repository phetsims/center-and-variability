// Copyright 2023, University of Colorado Boulder

import { AlignBox, AlignGroup, Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import VariabilityPlotNode from './VariabilityPlotNode.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VariabilityReadoutText from './VariabilityReadoutText.js';
import CAVColors from '../../common/CAVColors.js';
import CAVAccordionBox from '../../common/view/CAVAccordionBox.js';
import CAVConstants from '../../common/CAVConstants.js';
import CAVSceneModel from '../../common/model/CAVSceneModel.js';
import Utils from '../../../../dot/js/Utils.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import VariabilityMeasureCheckbox from './VariabilityMeasureCheckbox.js';

export default class VariabilityAccordionBox extends CAVAccordionBox {

  private readonly plotToggleNode: ToggleNode<CAVSceneModel, VariabilityPlotNode>;

  public constructor( model: VariabilityModel, layoutBounds: Bounds2, tandem: Tandem, top: number ) {

    // Specify a "footprint" within which we do all the layout.
    const backgroundShape = CAVConstants.ACCORDION_BOX_CONTENTS_SHAPE_VARIABILITY;
    const backgroundNode = CAVAccordionBox.createBackgroundNode( backgroundShape );

    // Determine which title string we are showing based off the selectedVariabilityMeasure
    const currentProperty = new DerivedProperty( [ model.selectedVariabilityMeasureProperty ], selectedVariability =>
      selectedVariability === VariabilityMeasure.RANGE ? CenterAndVariabilityStrings.rangeStringProperty :
      selectedVariability === VariabilityMeasure.IQR ? CenterAndVariabilityStrings.interquartileRangeIQRStringProperty :
      CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty
    );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    const contents = _.range( 4 ).map( i => {
      return {
        value: model.sceneModels[ i ],
        createNode: ( tandem: Tandem ) => new VariabilityPlotNode( model, model.variabilitySceneModels[ i ], {
          tandem: tandem.createTandem( `plotNode${i + 1}` ),
          bottom: backgroundShape.bounds.height
        } )
      };
    } );

    const plotToggleNode = new ToggleNode( model.selectedSceneModelProperty, contents, {
      bottom: backgroundShape.bounds.height
    } );

    const infoButton = new InfoButton( {
      iconFill: 'cornflowerblue',
      scale: 0.5,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'infoButton' ),
      listener: () => {
        model.isInfoVisibleProperty.value = true;
      },
      top: backgroundShape.bounds.top,
      right: backgroundShape.bounds.right
    } );
    backgroundNode.addChild( infoButton );

    // Ensure a consistent width among both the icons and the text across the different accordionBox views.
    const textGroup = new AlignGroup();
    const iconGroup = new AlignGroup();

    const checkboxToggleNode = new AlignBox( new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      createNode: tandem => new VariabilityMeasureCheckbox( model.isRangeVisibleProperty,
        CenterAndVariabilityStrings.rangeStringProperty, iconGroup, textGroup, CAVColors.rangeFillProperty, { tandem: tandem } ),
      tandemName: 'rangeAccordionCheckbox',
      value: VariabilityMeasure.RANGE
    }, {
      createNode: tandem => new VariabilityMeasureCheckbox( model.isIQRVisibleProperty,
        CenterAndVariabilityStrings.iqrStringProperty, iconGroup, textGroup, CAVColors.iqrColorProperty, { tandem: tandem } ),
      tandemName: 'iqrAccordionCheckbox',
      value: VariabilityMeasure.IQR
    }, {
      createNode: tandem => new VariabilityMeasureCheckbox( model.isMADVisibleProperty,
        CenterAndVariabilityStrings.madStringProperty, iconGroup, textGroup, CAVColors.madRectangleColorProperty, { tandem: tandem } ),
      tandemName: 'madAccordionCheckbox',
      value: VariabilityMeasure.MAD
    } ], {
      alignChildren: ToggleNode.RIGHT
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'right', yAlign: 'center' } );

    backgroundNode.addChild( plotToggleNode );
    backgroundNode.addChild( checkboxToggleNode );

    const deriveValueProperty = ( accessor: ( variabilitySceneModel: VariabilitySceneModel ) => TReadOnlyProperty<number | null> ) => {
      return DerivedProperty.deriveAny( [ model.selectedSceneModelProperty, ...model.variabilitySceneModels.map( accessor ) ], () => {
        return accessor( model.selectedSceneModelProperty.value as VariabilitySceneModel ).value;
      } );
    };

    const rangeValueProperty = deriveValueProperty( vsm => vsm.rangeValueProperty );
    const medianValueProperty = deriveValueProperty( vsm => vsm.medianValueProperty );
    const iqrValueProperty = deriveValueProperty( vsm => vsm.iqrValueProperty );
    const madValueProperty = deriveValueProperty( vsm => vsm.madValueProperty );
    const meanValueProperty = deriveValueProperty( vsm => vsm.meanValueProperty );

    const readoutsToggleNode = new AlignBox( new ToggleNode( model.selectedVariabilityMeasureProperty, [ {
      value: VariabilityMeasure.RANGE,
      tandemName: 'rangeReadoutToggleNode',
      createNode: tandem => {
        const rangeReadoutValueProperty = new DerivedProperty( [ rangeValueProperty ],
          rangeValue => rangeValue === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value : `${rangeValue}`
        );

        const rangeReadoutText = new VariabilityReadoutText( rangeReadoutValueProperty, CenterAndVariabilityStrings.rangeEqualsValuePatternStringProperty, {
          fill: CAVColors.meanColorProperty,
          visibleProperty: model.isRangeVisibleProperty,
          tandem: tandem.createTandem( 'rangeReadoutText' )
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new VBox( {
          align: 'left',
          spacing: 10,
          children: [ rangeReadoutText ]
        } );
      }
    }, {
      value: VariabilityMeasure.IQR,
      tandemName: 'iqrReadoutToggleNode',
      createNode: tandem => {
        const medianReadoutValueProperty = new DerivedProperty( [ medianValueProperty ],
          medianValue => medianValue === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value : `${medianValue}`
        );
        const iqrReadoutValueProperty = new DerivedProperty( [ iqrValueProperty ], iqrValue => {
          return iqrValue === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value : `${iqrValue}`;
        } );

        const medianReadoutText = new VariabilityReadoutText( medianReadoutValueProperty, CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty, {
          fill: CAVColors.medianColorProperty,
          tandem: tandem.createTandem( 'medianReadoutText' )
        } );
        const iqrReadoutText = new VariabilityReadoutText( iqrReadoutValueProperty, CenterAndVariabilityStrings.iqrEqualsValuePatternStringProperty, {
          fill: CAVColors.iqrLabelColorProperty,
          visibleProperty: model.isIQRVisibleProperty,
          tandem: tandem.createTandem( 'iqrReadoutText' )
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new VBox( {
          align: 'left',
          spacing: 10,
          children: [
            medianReadoutText,
            iqrReadoutText
          ]
        } );
      }
    }, {
      value: VariabilityMeasure.MAD,
      tandemName: 'madReadoutToggleNode',
      createNode: tandem => {
        const madReadoutValueProperty = new DerivedProperty( [ madValueProperty ], madValue => {
          return madValue === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value : `${Utils.toFixed( madValue, 1 )}`;
        } );
        const meanReadoutValueProperty = new DerivedProperty( [ meanValueProperty ], meanValue => {
          return meanValue === null ? CenterAndVariabilityStrings.valueUnknownStringProperty.value : `${Utils.toFixed( meanValue, 1 )}`;
        } );

        const meanReadoutText = new VariabilityReadoutText( meanReadoutValueProperty, CenterAndVariabilityStrings.meanEqualsValuePatternStringProperty, {
          fill: CAVColors.meanColorProperty,
          tandem: tandem.createTandem( 'meanReadoutText' )
        } );
        const madReadoutText = new VariabilityReadoutText( madReadoutValueProperty, CenterAndVariabilityStrings.madEqualsValuePatternStringProperty, {
          fill: CAVColors.madColorProperty,
          visibleProperty: model.isMADVisibleProperty,
          tandem: tandem.createTandem( 'madReadoutText' )
        } );

        // Nest in a new Node so that ToggleNode has independent control over the visibility
        return new VBox( {
          spacing: 10,
          align: 'left',
          children: [
            meanReadoutText,
            madReadoutText
          ]
        } );
      }
    } ], {
      alignChildren: ToggleNode.NONE,
      tandem: tandem.createTandem( 'readoutsToggleNode' )
    } ), { alignBounds: backgroundShape.bounds, xAlign: 'left', yAlign: 'center' } );

    backgroundNode.addChild( readoutsToggleNode );

    super( backgroundNode, {
      tandem: tandem,
      titleNode: new Text( accordionBoxTitleProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 300
      } ),
      left: 65
    } );

    this.plotToggleNode = plotToggleNode;
  }

  public alignWithPlayAreaNumberLineNode( x: number ): void {
    this.plotToggleNode.nodes.forEach( plotNode => plotNode.alignWithPlayAreaNumberLineNode( x ) );
  }
}

centerAndVariability.register( 'VariabilityAccordionBox', VariabilityAccordionBox );