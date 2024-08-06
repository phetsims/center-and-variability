// Copyright 2022-2024, University of Colorado Boulder

/**
 * VariabilityModel represents the core data model for the "Variability" screen. It manages and tracks the state of
 * various measures of variability, such as range, interquartile range (IQR), and mean absolute deviation (MAD).
 * This model also encompasses functionality related to the pointer on the number line, individual soccer player scenes,
 * and the interval tool.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import Property from '../../../../axon/js/Property.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VariabilityMeasure from './VariabilityMeasure.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import VariabilitySceneModel from './VariabilitySceneModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberTone from '../../../../soccer-common/js/model/NumberTone.js';
import IntervalToolModel from './IntervalToolModel.js';
import KickDistributionStrategy, { KickDistributionStrategySpecification } from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import { TColor } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;
type VariabilityModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class VariabilityModel extends CAVModel {

  // The variability measure that is currently selected to display in the accordion box
  public readonly selectedVariabilityMeasureProperty: Property<VariabilityMeasure>;

  // Whether the range is being shown in the accordion box
  public readonly isRangeVisibleProperty: Property<boolean>;

  // Whether the IQR is being shown in the accordion box
  public readonly isIQRVisibleProperty: Property<boolean>;

  // Whether the MAD is being shown in the accordion box
  public readonly isMADVisibleProperty: Property<boolean>;

  // Whether the pointer arrow is being shown under the number line on the soccer field
  public readonly isPointerVisibleProperty: Property<boolean>;

  // The value on the number line that the pointer is currently set
  public readonly pointerValueProperty: Property<number>;

  // Whether the pointer is currently being dragged by the keyboard. Used to avoid conflicts between keyboard and mouse/touch interaction.
  public readonly isPointerKeyboardDraggingProperty: Property<boolean>;

  // Emitter that is fired on reset
  public readonly resetEmitter = new Emitter();

  // The scenes for individual players on the 'Variability' screen
  public readonly variabilitySceneModels: VariabilitySceneModel[];

  public readonly intervalToolModel: IntervalToolModel;

  public constructor( providedOptions: VariabilityModelOptions ) {

    let sceneTandemIndex = 1;

    const createVariabilitySceneModel = ( kickDistributionStrategySpecification: KickDistributionStrategySpecification,
                                          kickerSceneColor: TColor ) => {

      const sceneTandem = providedOptions.tandem.createTandem( `sceneKicker${sceneTandemIndex++}Model` );
      const kickDistributionStrategy = new KickDistributionStrategy(
        kickDistributionStrategySpecification.type,
        kickDistributionStrategySpecification.values,
        kickDistributionStrategySpecification.skewType, {
          rightSkewedData: [
            10, 25, 45, 30, 18,
            12, 10, 5, 4, 4,
            4, 4, 4, 4, 4
          ],
          probabilityByDistanceDocumentationValues: '[0,0,1,3,5,7,3,3,1,1,0,0,0,0,1]',
          distanceByIndexDocumentationValues: '[5,11,9,12,10,2,7,3,4,14,1,15,8,13,2,4,12,10,6,1,13,9,3,14,5,6,11,8,7,15]',
          valuesRange: CAVConstants.PHYSICAL_RANGE,
          maxKicks: CAVConstants.MAX_KICKS_VALUES[ CAVConstants.MAX_KICKS_VALUES.length - 1 ],
          tandem: sceneTandem.createTandem( 'kickDistributionStrategy' ),
          phetioFeatured: true
        } );
      return new VariabilitySceneModel( MAX_KICKS_PROPERTY,
        kickDistributionStrategy,
        kickerSceneColor,
        sceneTandem );
    };

    // If a new variability scene model is added, a new color associated with that model needs to be added in CAVConstants as well.
    const sceneModels = [
      createVariabilitySceneModel( {
        type: 'probabilityByDistance',
        values: [ 0, 0, 0, 1, 3, 12, 20, 32, 20, 12, 3, 1, 0, 0, 0 ],
        skewType: null
      }, CAVConstants.VARIABILITY_KICKER_COLORS[ 0 ] ),
      createVariabilitySceneModel( {
        type: 'probabilityByDistance',
        values: [ 3, 5, 10, 10, 25, 32, 45, 65, 45, 32, 25, 10, 10, 5, 3 ],
        skewType: null
      }, CAVConstants.VARIABILITY_KICKER_COLORS[ 1 ] ),
      createVariabilitySceneModel( {
        type: 'skew',
        values: null,
        skewType: 'right'
      }, CAVConstants.VARIABILITY_KICKER_COLORS[ 2 ] ),
      createVariabilitySceneModel( {
        type: 'skew',
        values: null,
        skewType: 'left'
      }, CAVConstants.VARIABILITY_KICKER_COLORS[ 3 ] )
    ];

    const accordionBoxTandem = providedOptions.tandem.createTandem( 'variabilityMeasureAccordionBox' );

    const options = optionize<VariabilityModelOptions, SelfOptions, CAVModelOptions>()( {
      accordionBoxTandem: accordionBoxTandem,
      instrumentMeanProperty: true,
      instrumentDataPointVisibilityProperty: true
    }, providedOptions );

    super( MAX_KICKS_PROPERTY, sceneModels, options );

    this.variabilitySceneModels = sceneModels;

    this.selectedVariabilityMeasureProperty = new EnumerationProperty( VariabilityMeasure.RANGE, {
      tandem: accordionBoxTandem.createTandem( 'selectedVariabilityMeasureProperty' ),
      phetioFeatured: true
    } );

    this.isRangeVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isRangeVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the range. Only relevant when the range radio button is active.'
    } );

    this.isIQRVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isIQRVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the IQR. Only relevant when the IQR radio button is active.'
    } );

    this.isMADVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isMADVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Sets the visibility of the MAD. Only relevant when the MAD radio button is active.'
    } );

    const pointerTandem = this.soccerAreaTandem.createTandem( 'pointer' );

    this.isPointerVisibleProperty = new BooleanProperty( false, {
      tandem: pointerTandem.createTandem( 'isPointerVisibleProperty' ),
      phetioFeatured: true
    } );

    this.pointerValueProperty = new NumberProperty( 5, {
      tandem: pointerTandem.createTandem( 'pointerValueProperty' ),
      phetioFeatured: true
    } );

    this.isPointerKeyboardDraggingProperty = new BooleanProperty( false );

    this.intervalToolModel = new IntervalToolModel( options.tandem.createTandem( 'intervalToolModel' ) );

    this.pointerValueProperty.lazyLink( ( value, oldValue ) => {
      if ( this.isPointerKeyboardDraggingProperty.value ) {
        NumberTone.playMean( value );
      }
      else if ( this.crossedCheckpoint( value, oldValue ) ) {
        NumberTone.playMean( Utils.roundToInterval( value, 0.5 ) );
      }
    } );
  }


  public override step( dt: number ): void {
    super.step( dt );

    this.intervalToolModel.updateDeltaStableProperty();
  }

  public override reset(): void {
    super.reset();

    this.selectedVariabilityMeasureProperty.reset();
    this.isRangeVisibleProperty.reset();
    this.isIQRVisibleProperty.reset();
    this.isMADVisibleProperty.reset();

    this.intervalToolModel.reset();

    this.pointerValueProperty.reset();
    this.isPointerVisibleProperty.reset();

    this.resetEmitter.emit();
  }
}

centerAndVariability.register( 'VariabilityModel', VariabilityModel );