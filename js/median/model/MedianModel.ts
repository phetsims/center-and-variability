// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import CardModel from '../../median/model/CardModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CAVConstants from '../../common/CAVConstants.js';
import { kickDistanceStrategyFromStateObject, RandomSkewStrategy } from '../../common/model/RandomSkewStrategy.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
type MedianModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class MedianModel extends CAVModel {

  public readonly cards: CardModel[];
  public readonly isSortingDataProperty: BooleanProperty;
  public readonly isTopMedianVisibleProperty: BooleanProperty;

  public constructor( providedOptions: MedianModelOptions ) {

    const options = optionize<MedianModelOptions, SelfOptions, CAVModelOptions>()( {
      instrumentMeanPredictionProperty: false
    }, providedOptions );

    const maxKicksProperty = new NumberProperty( 15, {
      validValues: [ 15 ],
      tandem: options.tandem.createTandem( 'maxKicksProperty' )
    } );

    const scene = new CAVSoccerSceneModel(
      maxKicksProperty,
      [ 15 ],
      new RandomSkewStrategy(),
      CAVConstants.PHYSICAL_RANGE,
      kickDistanceStrategyFromStateObject, {
        tandem: options.tandem.createTandem( 'sceneModel' )
      } );

    super( maxKicksProperty, [ scene ], options );

    this.cards = this.sceneModels[ 0 ].soccerBalls.map( ( soccerBall, index ) => new CardModel( soccerBall, {
      tandem: options.tandem.createTandem( 'cards' ).createTandemIndex1( 'card', index )
    } ) );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSortingDataProperty' )
    } );

    this.isTopMedianVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isTopMedianVisibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.isSortingDataProperty.reset();
    this.isTopMedianVisibleProperty.reset();
  }
}

centerAndVariability.register( 'MedianModel', MedianModel );