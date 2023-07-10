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
import { kickDistanceStrategyFromStateObject, RandomSkewStrategy } from '../../common/model/RandomSkewStrategy.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import CAVSoccerBall from '../../common/model/CAVSoccerBall.js';
import NumberTone from '../../soccer-common/model/NumberTone.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import CardContainerModel from './CardContainerModel.js';

type SelfOptions = EmptySelfOptions;
type MedianModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class MedianModel extends CAVModel {

  public readonly cardContainerModel: CardContainerModel;
  public readonly isSortingDataProperty: BooleanProperty;
  public readonly isTopMedianVisibleProperty: BooleanProperty;
  public readonly areCardsSortedProperty: BooleanProperty;

  public constructor( providedOptions: MedianModelOptions ) {

    const options = optionize<MedianModelOptions, SelfOptions, CAVModelOptions>()( {
      instrumentMeanPredictionProperty: false
    }, providedOptions );

    const maxKicksAllowed = [ 5, 10, 15 ];

    const maxKicksProperty = new DerivedProperty( [ MAX_KICKS_PROPERTY ], maxKicks => {
      return maxKicksAllowed.includes( maxKicks ) ? maxKicks : maxKicksAllowed[ maxKicksAllowed.length - 1 ];
    }, {
      validValues: maxKicksAllowed,
      phetioValueType: NumberIO,
      tandem: options.tandem.createTandem( 'maxKicksProperty' )
    } );

    const sceneModel = new CAVSoccerSceneModel(
      maxKicksProperty,
      maxKicksAllowed,
      new RandomSkewStrategy(),
      false,
      CAVConstants.PHYSICAL_RANGE,
      kickDistanceStrategyFromStateObject,
      CAVSoccerBall.createSoccerBall, {
        tandem: options.tandem.createTandem( 'sceneModel' )
      } );

    sceneModel.soccerBalls.forEach( soccerBall => {
      soccerBall.toneEmitter.addListener( value => {
        NumberTone.play( this, sceneModel, value );
      } );
    } );

    super( maxKicksProperty, [ sceneModel ], options );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSortingDataProperty' )
    } );

    this.isTopMedianVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isTopMedianVisibleProperty' )
    } );

    // For PhET-iO
    this.areCardsSortedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'areCardsSortedProperty' ),
      phetioReadOnly: true
    } );

    this.cardContainerModel = new CardContainerModel( this, { tandem: options.tandem.createTandem( 'cardContainerModel' ), parentContext: 'accordion' } );
  }

  public override reset(): void {
    super.reset();
    this.isSortingDataProperty.reset();
    this.isTopMedianVisibleProperty.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.cardContainerModel.step( dt );
  }
}

centerAndVariability.register( 'MedianModel', MedianModel );