// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the "Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import centerAndVariability from '../../centerAndVariability.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CardModel from '../../common/model/CardModel.js';
import CAVObject from '../../common/model/CAVObject.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';

export default class MedianModel extends CAVModel {

  // For PhET-iO State, it is difficult to power 2 views from one model, see https://github.com/phetsims/phet-io/issues/1688#issuecomment-1032967603
  // Therefore, we introduce a minimal model element for the cards, so they can be managed by the state
  public readonly cardModelGroup: PhetioGroup<CardModel, [ CAVObject ]>;

  public readonly isSortingDataProperty: BooleanProperty;

  public constructor( options: CAVModelOptions ) {
    super( options );
    this.cardModelGroup = new PhetioGroup( ( tandem, cavObject ) => {
      assert && assert( cavObject, 'cavObject should be defined' );
      return new CardModel( cavObject, {
        tandem: tandem
      } );
    }, () => [ this.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( CardModel.CardModelIO ),
      tandem: options.tandem.createTandem( 'cardModelGroup' )
    } );

    this.isSortingDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSortingDataProperty' )
    } );
  }

  public override clearData(): void {
    super.clearData();
    this.cardModelGroup.clear();
  }

  public override reset(): void {
    super.reset();
    this.isSortingDataProperty.reset();
  }

  protected override objectCreated( cavObject: CAVObject ): void {
    super.objectCreated( cavObject );
    this.cardModelGroup.createNextElement( cavObject );
  }
}

centerAndVariability.register( 'MedianModel', MedianModel );