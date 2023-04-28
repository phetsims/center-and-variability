// Copyright 2022-2023, University of Colorado Boulder

/**
 * Minimal model element for each CardNode, in order to support PhET-iO State.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import CAVObject from './CAVObject.js';
import centerAndVariability from '../../centerAndVariability.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { AnimationMode } from './AnimationMode.js';

type SelfOptions = EmptySelfOptions;
type CardModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CardModel {

  public readonly soccerBall: CAVObject;
  public readonly isActiveProperty: BooleanProperty;

  public constructor( soccerBall: CAVObject, options: CardModelOptions ) {
    this.soccerBall = soccerBall;
    this.isActiveProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isActiveProperty' )
    } );

    Multilink.multilink( [
        soccerBall.isActiveProperty,
        soccerBall.animationModeProperty,
        soccerBall.valueProperty ],
      ( isActive, animationMode, value ) => {
        this.isActiveProperty.value = isActive && animationMode !== AnimationMode.FLYING && value !== null;
      } );
  }

  public reset(): void {
    this.isActiveProperty.reset(); // TODO: unnecessary if we reset the soccerBall
  }
}

centerAndVariability.register( 'CardModel', CardModel );