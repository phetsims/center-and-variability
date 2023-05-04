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
import CAVSceneModel from '../../common/model/CAVSceneModel.js';
import CAVModel from '../../common/model/CAVModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MedianModel extends CAVModel {

  public readonly cards: CardModel[];
  public readonly isSortingDataProperty: BooleanProperty;

  public constructor( options: { tandem: Tandem } ) {
    const scene = new CAVSceneModel( CAVSceneModel.chooseDistribution(), { tandem: options.tandem.createTandem( 'sceneModel' ) } );
    super( [ scene ], {
      ...options,
      instrumentMeanPredictionProperty: false
    } );

    this.cards = this.sceneModels[ 0 ].soccerBalls.map( ( soccerBall, index ) => new CardModel( soccerBall, {
      tandem: options.tandem.createTandem( 'cards' ).createTandem( 'card' + index )
    } ) );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSortingDataProperty' )
    } );
  }

  public override reset(): void {
    this.isSortingDataProperty.reset();
    super.reset();
  }
}

centerAndVariability.register( 'MedianModel', MedianModel );