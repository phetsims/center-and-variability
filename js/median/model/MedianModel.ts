// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import CAVSoccerBall from '../../common/model/CAVSoccerBall.js';
import NumberTone from '../../common/model/NumberTone.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import SoccerCommonPreferencesModel from '../../../../soccer-common/js/model/SoccerCommonPreferencesModel.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import InteractiveCardContainerModel from './InteractiveCardContainerModel.js';

type SelfOptions = EmptySelfOptions;
type MedianModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class MedianModel extends CAVModel {

  public readonly interactiveCardContainerModel: InteractiveCardContainerModel;
  public readonly isSortingDataProperty: BooleanProperty;
  public readonly medianVisibleProperty: BooleanProperty;
  public readonly areCardsSortedProperty: BooleanProperty;

  public constructor( preferencesModel: SoccerCommonPreferencesModel, providedOptions: MedianModelOptions ) {

    const accordionBoxTandem = providedOptions.tandem.createTandem( 'distanceAccordionBox' );

    const options = optionize<MedianModelOptions, SelfOptions, CAVModelOptions>()( {
      accordionBoxTandem: accordionBoxTandem,
      instrumentMeanProperty: false,
      instrumentDataPointVisibilityProperty: false
    }, providedOptions );

    const maxKicksAllowed = [ 5, 10, 15 ];

    const maxKicksProperty = new DerivedProperty( [ MAX_KICKS_PROPERTY ], maxKicks => {
      return maxKicksAllowed.includes( maxKicks ) ? maxKicks : maxKicksAllowed[ maxKicksAllowed.length - 1 ];
    }, {
      validValues: maxKicksAllowed,
      phetioValueType: NumberIO,
      tandem: options.tandem.createTandem( 'maxKicksProperty' ),
      phetioDocumentation: 'The Median screen is restricted to a maximum of 15 kicks.',
      phetioFeatured: true
    } );

    const sceneModel = new CAVSoccerSceneModel(
      maxKicksProperty,
      maxKicksAllowed,
      { type: 'randomSkew', skewType: KickDistributionStrategy.chooseSkewDirection(), values: null },
      false,
      CAVConstants.PHYSICAL_RANGE,
      CAVSoccerBall.createSoccerBall,
      preferencesModel.kickerCharacterSetProperty, {
        tandem: options.tandem.createTandem( 'sceneModel' )
      } );

    sceneModel.soccerBalls.forEach( soccerBall => {
      soccerBall.toneEmitter.addListener( value => {
        NumberTone.play( this, sceneModel, value );
      } );
    } );

    super( maxKicksProperty, [ sceneModel ], options );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isSortingDataProperty' ),
      phetioFeatured: true
    } );

    this.medianVisibleProperty = new BooleanProperty( false, {
      tandem: accordionBoxTandem.createTandem( 'isMedianVisibleProperty' ),
      phetioFeatured: true
    } );

    // For PhET-iO
    this.areCardsSortedProperty = new BooleanProperty( true, {
      tandem: accordionBoxTandem.createTandem( 'areCardsSortedProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.interactiveCardContainerModel = new InteractiveCardContainerModel( this, {
      tandem: accordionBoxTandem.createTandem( 'cardContainerModel' ), parentContext: 'accordion'
    } );
  }

  public override reset(): void {
    super.reset();
    this.isSortingDataProperty.reset();
    this.medianVisibleProperty.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.interactiveCardContainerModel.step( dt );
  }
}

centerAndVariability.register( 'MedianModel', MedianModel );