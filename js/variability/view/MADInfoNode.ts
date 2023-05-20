// Copyright 2023, University of Colorado Boulder

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { HBox, HSeparator, Text, VBox } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import VariabilityModel from '../model/VariabilityModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import Utils from '../../../../dot/js/Utils.js';
import CAVConstants from '../../common/CAVConstants.js';
import MADNode from './MADNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

export default class MADInfoNode extends VBox {
  public constructor( model: VariabilityModel, sceneModel: VariabilitySceneModel, options: PickRequired<PhetioObject, 'tandem'> ) {

    const hasEnoughDataProperty = new DerivedProperty( [ sceneModel.numberOfDataPointsProperty ], numberOfDataPoints => numberOfDataPoints >= 1 );

    const numeratorText = new Text( '', { fontSize: 16, maxWidth: 550 } );
    const denominatorText = new Text( '', { fontSize: 16 } );

    const resultNumeratorText = new Text( '', { fontSize: 16 } );
    const resultDenominatorText = new Text( '', { fontSize: 16 } );

    const footnoteVisibleProperty = new BooleanProperty( false );
    const footnoteAsterisk = new Text( '*', {
      fontSize: 16,
      visibleProperty: footnoteVisibleProperty
    } );

    sceneModel.objectChangedEmitter.addListener( () => {
      const values = sceneModel.getSortedLandedObjects().map( landedObject => landedObject.valueProperty.value! );
      const mads = values.map( value => Math.abs( value - sceneModel.meanValueProperty.value! ) );
      const madStrings = mads.map( mad => Utils.toFixed( mad, 1 ) );
      numeratorText.string = madStrings.join( ' + ' );
      denominatorText.string = values.length.toString();

      const sum = _.reduce( mads, ( sum, mad ) => sum + mad, 0 );
      resultNumeratorText.string = Utils.toFixed( sum, 1 );
      resultDenominatorText.string = values.length.toString();

      // Double check the result to see if the printed strings match. There may be an inconsistency because of when the values
      // are rounded.  See https://github.com/phetsims/center-and-variability/issues/169
      const leftHandTerms = madStrings.map( Number.parseFloat );
      const leftHandSum = _.reduce( leftHandTerms, ( sum, term ) => sum + term, 0 );
      const rightHandSum = Number.parseFloat( resultNumeratorText.string );

      footnoteVisibleProperty.value = Math.abs( leftHandSum - rightHandSum ) > 1E-6;
      if ( phet.chipper.queryParameters.dev && footnoteVisibleProperty.value ) {
        console.log( 'values do not match: LHS = ' + numeratorText.string + ' = ' + leftHandSum + ', but RHS = ' + rightHandSum + ' = ' + resultNumeratorText.string );
      }
    } );

    const calculationFraction = new VBox( {
      children: [ numeratorText, new HSeparator(), denominatorText ],
      align: 'center'
    } );

    const resultFraction = new VBox( {
      children: [ resultNumeratorText, new HSeparator(), resultDenominatorText ],
      align: 'center'
    } );

    super( {
      align: 'left',
      spacing: 6,
      children: [
        new Text( CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty, {
          fontSize: 25,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_HEADING_BOTTOM_MARGIN }
        } ),
        new Text( CenterAndVariabilityStrings.madDescriptionStringProperty, {
          fontSize: 18,
          maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH,
          layoutOptions: { bottomMargin: CAVConstants.INFO_DIALOG_SUBHEADING_BOTTOM_MARGIN }
        } ),

        new HBox( {
          spacing: 6,
          align: 'top',
          children: [
            new HBox( {
              spacing: 10,
              children: [
                new Text( CenterAndVariabilityStrings.madEqualsStringProperty, { fontSize: 18 } ),
                calculationFraction,
                new Text( MathSymbols.EQUAL_TO, { fontSize: 18 } ),
                resultFraction
              ],
              visibleProperty: hasEnoughDataProperty
            } ),

            // Show the footnote to the top right of the errant equation, if they don't match. I tried a ManualConstraint
            // for this, but it went into an infinite loop.
            footnoteAsterisk
          ]
        } ),

        new Text( new PatternStringProperty( CenterAndVariabilityStrings.madCalculationResultPatternStringProperty, {
          mad: new DerivedProperty( [ sceneModel.madValueProperty ], madValue => madValue === null ? null : Utils.toFixed( madValue, 1 ) )
        } ), { fontSize: 18, visibleProperty: hasEnoughDataProperty, maxWidth: CAVConstants.INFO_DIALOG_MAX_TEXT_WIDTH, layoutOptions: { bottomMargin: 10 } } ),

        new HBox( {
          visibleProperty: footnoteVisibleProperty,
          children: [
            new Text( '*', { fontSize: 14 } ),
            new Text( CenterAndVariabilityStrings.valuesMayNotMatchDueToRoundingErrorsStringProperty, {
              fontSize: 12
            } )
          ]
        } ),

        new MADNode( model, sceneModel, {
          parentContext: 'info',
          tandem: options.tandem.createTandem( 'madNode' )
        } )
      ]
    } );
  }
}

centerAndVariability.register( 'MADInfoNode', MADInfoNode );