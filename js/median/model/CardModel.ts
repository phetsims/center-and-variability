// Copyright 2022-2023, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import SoccerBall from '../../soccer-common/model/SoccerBall.js';
import centerAndVariability from '../../centerAndVariability.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { SoccerBallPhase } from '../../soccer-common/model/SoccerBallPhase.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import CardContainerModel from './CardContainerModel.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import Emitter from '../../../../axon/js/Emitter.js';

type SelfOptions = EmptySelfOptions;
type CardModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class CardModel extends PhetioObject {

  public readonly soccerBall: SoccerBall;
  public readonly isActiveProperty: TReadOnlyProperty<boolean>;
  public readonly positionProperty: Vector2Property;

  // Track whether the card is being dragged, for purposes of hiding the drag indicator arrow when the user
  // has dragged a sufficient amount and to play sound effects for the dragged card
  public isDragging = false;

  // Avoid sound effects for cards that landed recently, since cards sometimes swap when a new soccer ball lands and "sort data" is checked.
  public timeSinceLanded = 0;

  // We can also specify a reason for the animation, in order to 'mute' sound effects for this card.
  public animationReason: 'valueChanged' | null = null;
  public animation: Animation | null = null;
  private animationTo: Vector2 | null = null;

  // Emit how far the card has been dragged for purposes of hiding the drag indicator arrow when the user
  // has dragged a sufficient amount
  public readonly dragDistanceEmitter: TEmitter<[ number ]> = new Emitter( {
    parameters: [ { valueType: 'number' } ]
  } );

  public constructor( public readonly cardContainerModel: CardContainerModel, soccerBall: SoccerBall, position: Vector2, providedOptions: CardModelOptions ) {

    const options = optionize<CardModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );


    this.soccerBall = soccerBall;
    this.isActiveProperty = new DerivedProperty( [ soccerBall.soccerBallPhaseProperty ], phase =>
      phase === SoccerBallPhase.STACKED || phase === SoccerBallPhase.STACKING, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioValueType: BooleanIO
    } );

    this.positionProperty = new Vector2Property( position, {
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'positionProperty' ),
      valueComparisonStrategy: 'equalsFunction'
    } );
    this.addLinkedElement( this.soccerBall );
  }

  public animateTo( destination: Vector2, duration: number, animationReason: 'valueChanged' | null = null ): void {

    if ( this.animation ) {

      assert && assert( !!this.animationTo, 'animationTo should be defined when animation is defined' );

      if ( destination.equals( this.animationTo! ) ) {

        // Already moving to the desired destination.
        this.animationReason = animationReason;
        return;
      }
      else {
        this.animation.stop();
      }
    }
    else {
      if ( destination.equals( this.positionProperty.value ) ) {

        // Already at the desired destination.
        return;
      }
    }
    this.animationReason = animationReason;

    this.animation = new Animation( {
      duration: duration,
      targets: [ {
        property: this.positionProperty,
        to: destination,
        easing: Easing.QUADRATIC_IN_OUT
      } ]
    } );
    this.animationTo = destination;

    this.animation.endedEmitter.addListener( () => {
      this.animation = null;
      this.animationTo = null;
      this.animationReason = null;
    } );

    this.animation.start();
  }
}

centerAndVariability.register( 'CardModel', CardModel );