// Copyright 2022-2025, University of Colorado Boulder

/**
 * CardModel is responsible for representing the individual cards in a card container, encapsulating their position,
 * active status, and the interactions related to a card, such as dragging and animations. It also monitors the state
 * of the associated SoccerBall and reflects its changes in the card.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import centerAndVariability from '../../centerAndVariability.js';
import CardContainerModel from './CardContainerModel.js';

type SelfOptions = EmptySelfOptions;
type CardModelOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class CardModel extends PhetioObject {

  public readonly soccerBall: SoccerBall;
  public readonly isActiveProperty: TReadOnlyProperty<boolean>;
  public readonly positionProperty: Vector2Property;

  // Where the card is in the line-up. If a card is not active it's index will be null.
  public readonly indexProperty: Property<number | null>;

  // Track whether the card is being dragged either through keyboard, mouse or touch input.
  // Triggers tracking for how far a card has been dragged in order to hide drag indicator,
  // plays sound effects for the dragged card, moves card to front when it is dragging, and animates
  // card up and to the left when it is grabbed.
  public readonly isDraggingProperty = new BooleanProperty( false );

  // Avoid sound effects for cards that landed recently, since cards sometimes swap when a new soccer ball lands and "sort data" is checked.
  public timeSinceLanded = 0;

  // We can also 'mute' sound effects for this card for certain scenarios.
  public animationSoundEnabled = true;
  public animation: Animation | null = null;
  private animationTo: Vector2 | null = null;

  // Emit how far the card has been dragged for purposes of hiding the drag indicator arrow when the user
  // has dragged a sufficient amount
  public readonly dragDistanceEmitter: TEmitter<[ number ]> = new Emitter( {
    parameters: [ { valueType: 'number' } ]
  } );

  public constructor( public readonly cardContainerModel: CardContainerModel, soccerBall: SoccerBall, position: Vector2, providedOptions: CardModelOptions ) {

    const options = optionize<CardModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      isDisposable: false,
      phetioType: CardModel.CardModelIO
    }, providedOptions );

    super( options );

    this.indexProperty = new Property<number | null>( null, {
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'indexProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: false
    } );

    this.soccerBall = soccerBall;

    this.isActiveProperty = new DerivedProperty( [ soccerBall.valueProperty ], value =>
      value !== null, {
      tandem: cardContainerModel.representationContext === 'accordion' ? options.tandem.createTandem( 'isActiveProperty' ) : Tandem.OPT_OUT,
      phetioValueType: BooleanIO
    } );

    this.positionProperty = new Vector2Property( position, {
      phetioReadOnly: true,

      // We do not want state to track the position, but clients may want access via the API. This change also came
      // after the sim was published with PhET-iO, and it does not seem worth a migration rule to remove it.
      phetioState: false,
      tandem: options.tandem.createTandem( 'positionProperty' ),
      valueComparisonStrategy: 'equalsFunction'
    } );
    this.addLinkedElement( this.soccerBall );
  }

  public animateTo( destination: Vector2, duration: number ): void {

    if ( this.animation ) {

      assert && assert( !!this.animationTo, 'animationTo should be defined when animation is defined' );

      if ( destination.equals( this.animationTo! ) ) {

        // Already moving to the desired destination.
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
      this.animationSoundEnabled = true;
    } );

    this.animation.start();
  }

  public static CardModelIO = new IOType<IntentionalAny, IntentionalAny>( 'CardModelIO', {
    valueType: CardModel
  } );
}

centerAndVariability.register( 'CardModel', CardModel );