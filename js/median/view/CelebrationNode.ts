// Copyright 2023, University of Colorado Boulder

/**
 * A panel that animates when a user has successfully sorted the cards in the Card Container.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Panel from '../../../../sun/js/Panel.js';
import centerAndVariability from '../../centerAndVariability.js';
import { LinearGradient, Text } from '../../../../scenery/js/imports.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CAVConstants from '../../common/CAVConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import AsyncCounter from '../../common/model/AsyncCounter.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import arrayRemove from '../../../../phet-core/js/arrayRemove.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import InteractiveCardContainerModel from '../model/InteractiveCardContainerModel.js';
import CardModel from '../model/CardModel.js';
import CardNode from './CardNode.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import sortCelebration_mp3 from '../../../sounds/sortCelebration_mp3.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

const successSoundClip = new SoundClip( sortCelebration_mp3, {
  initialOutputLevel: 0.3
} );
soundManager.addSoundGenerator( successSoundClip );

export default class CelebrationNode extends Panel {

  //REVIEW document fields
  public isReadyForCelebration = false;
  private dataSortedNodeAnimation: Animation | null = null;
  private remainingCelebrationAnimations: ( () => void )[] = [];

  public constructor( private readonly cardContainerModel: InteractiveCardContainerModel,
                      private readonly cardMap: Map<CardModel, CardNode>,
                      resetEmitter: TEmitter
  ) {
    const dataSortedTextNode = new Text( CenterAndVariabilityStrings.youSortedTheDataStringProperty, {
      font: new PhetFont( 15 ),
      maxWidth: CAVConstants.CARD_DIMENSION * 10
    } );

    super( dataSortedTextNode, {
      stroke: null,
      cornerRadius: 4,
      lineWidth: 2,
      visible: false,
      isDisposable: false
    } );

    // create a rotated linear gradient
    const gradientMargin = 20;
    const startPoint = new Vector2( this.left + gradientMargin, this.top + gradientMargin );
    const endPoint = new Vector2( this.right - gradientMargin, this.bottom - gradientMargin );
    const gradient = new LinearGradient( startPoint.x, startPoint.y, endPoint.x, endPoint.y );
    gradient.addColorStop( 0, '#fa9696' );
    gradient.addColorStop( 0.2, '#ffa659' );
    gradient.addColorStop( 0.4, '#ebd75e' );
    gradient.addColorStop( 0.6, '#8ce685' );
    gradient.addColorStop( 0.8, '#7fd7f0' );
    gradient.addColorStop( 1, '#927feb' );
    gradient.setTransformMatrix( Matrix3.rotationAroundPoint( Math.PI / 4 * 1.2, this.center ) );
    this.stroke = gradient;

    resetEmitter.addListener( () => {
      this.visible = false;
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
        this.dataSortedNodeAnimation = null;
      }
    } );

  }

  public celebrate(): void {
    const cardCells = this.cardContainerModel.getCardsInCellOrder();
    const inProgressAnimations = cardCells.filter( card => card.animation ).map( card => card.animation! );

    // Setup a callback for animation when all current animations finish
    const asyncCounter = new AsyncCounter( inProgressAnimations.length, () => {

      const leftmostCard = this.cardMap.get( cardCells[ 0 ] )!;
      assert && assert( leftmostCard, 'leftmostCard should be defined' );

      this.centerX = this.cardContainerModel.getCardPositionX( ( cardCells.length - 1 ) / 2 ) + CAVConstants.CARD_DIMENSION / 2;
      this.top = leftmostCard.bottom + 7;

      if ( this.left < 0 ) {
        this.left = 0;
      }
      this.opacity = 1;
      this.visible = true;

      // If the user sorted the data again before the data sorted message was hidden, clear out the timer.
      if ( this.dataSortedNodeAnimation ) {
        this.dataSortedNodeAnimation.stop();
      }

      // start a timer to hide the data sorted node
      this.dataSortedNodeAnimation = new Animation( {
        duration: 0.6,
        delay: 2,
        targets: [ {
          property: this.opacityProperty,
          to: 0,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      this.dataSortedNodeAnimation.finishEmitter.addListener( () => {
        this.visible = false;
        this.dataSortedNodeAnimation = null;
      } );
      this.dataSortedNodeAnimation.start();

      successSoundClip.play();

      const cardBeingDragged = Array.from( this.cardMap.values() ).filter( cardNode => cardNode.dragListener.isPressed ).length;
      const cardsAnimating = cardCells.filter( card => card.animation ).length;
      if ( cardBeingDragged === 0 && cardsAnimating === 0 ) {
        this.pickable = false;

        this.animateRandomCelebration( () => {

          this.isReadyForCelebration = false;
          this.pickable = true;
          this.interruptSubtreeInput();
        } );
      }
    } );

    // Notify the asyncCounter when any in-progress animation finishes
    inProgressAnimations.forEach( animation => {
      animation.endedEmitter.addListener( () => asyncCounter.increment() );
    } );
  }


  private animateRandomCelebration( callback: () => void ): void {
    if ( this.remainingCelebrationAnimations.length === 0 ) {
      const animations = [
        () => this.animateCelebration1( callback, true ),
        () => this.animateCelebration2( callback ),
        () => this.animateCelebration3( callback )
      ];

      this.remainingCelebrationAnimations.push( ...animations );
    }

    const animation = dotRandom.sample( this.remainingCelebrationAnimations );
    arrayRemove( this.remainingCelebrationAnimations, animation );
    animation();
  }

  /**
   * The cards grow and then shrink back to normal size.
   */
  public animateCelebration1( callback: () => void, animateFromCenter: boolean ): void {
    const cardCells = this.cardContainerModel.getCardsInCellOrder();
    const asyncCounter = new AsyncCounter( cardCells.length, callback );

    cardCells.forEach( card => {
      const cardNode = this.cardMap.get( card )!;

      const scaleProperty = new NumberProperty( 1 );
      scaleProperty.lazyLink( scale => {
        const center = cardNode.center.copy();
        cardNode.setScaleMagnitude( scale );
        if ( animateFromCenter ) {
          cardNode.center = center;
        }
      } );

      const scaleUpAnimation = new Animation( {
        duration: animateFromCenter ? 0.2 : 0.15,
        targets: [ {
          property: scaleProperty,
          to: animateFromCenter ? 1.2 : 1.15,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      const scaleDownAnimation = new Animation( {
        duration: animateFromCenter ? 0.2 : 0.15,
        targets: [ {
          property: scaleProperty,
          to: 1,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      scaleDownAnimation.endedEmitter.addListener( () => asyncCounter.increment() );
      scaleUpAnimation.then( scaleDownAnimation );
      scaleUpAnimation.start();
    } );
  }

  /**
   * The cards do one clockwise rotation.
   */
  private animateCelebration2( callback: () => void ): void {
    const cardCells = this.cardContainerModel.getCardsInCellOrder();
    const asyncCounter = new AsyncCounter( cardCells.length, callback );

    cardCells.forEach( card => {
      const cardNode = this.cardMap.get( card )!;

      const center = cardNode.center.copy();

      const rotationProperty = new NumberProperty( 0 );
      rotationProperty.link( rotation => cardNode.setRotation( rotation ) );

      const animation = new Animation( {
        duration: 0.6,
        targets: [ {
          property: rotationProperty,
          to: 2 * Math.PI,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );
      const updatePosition = () => {
        cardNode.center = center;
      };
      animation.updateEmitter.addListener( updatePosition );
      animation.endedEmitter.addListener( () => asyncCounter.increment() );
      animation.start();
    } );
  }

  /**
   * The cards do the "wave" from left to right.
   */
  private animateCelebration3( callback: () => void ): void {
    const cardCells = this.cardContainerModel.getCardsInCellOrder();
    const asyncCounter = new AsyncCounter( cardCells.length, callback );

    cardCells.forEach( ( card, index ) => {
      const cardNode = this.cardMap.get( card )!;

      const initialPositionY = cardNode.y;
      const jumpHeight = 30;
      const positionYProperty = new NumberProperty( initialPositionY );
      positionYProperty.link( positionY => { cardNode.y = positionY; } );

      const goUpAnimation = new Animation( {
        duration: 0.2,
        targets: [ {
          property: positionYProperty,
          to: initialPositionY - jumpHeight,
          easing: Easing.QUADRATIC_IN_OUT
        } ]
      } );

      goUpAnimation.endedEmitter.addListener( () => {
        const goDownAnimation = new Animation( {
          duration: 0.2,
          targets: [ {
            property: positionYProperty,
            to: initialPositionY,
            easing: Easing.QUADRATIC_IN_OUT
          } ]
        } );
        goDownAnimation.endedEmitter.addListener( () => asyncCounter.increment() );
        goDownAnimation.start();
      } );

      // offset starting the animation for each card
      stepTimer.setTimeout( () => {
        goUpAnimation.start();
      }, index * 60 );
    } );
  }
}

centerAndVariability.register( 'CelebrationNode', CelebrationNode );