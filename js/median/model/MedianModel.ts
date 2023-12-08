// Copyright 2022-2023, University of Colorado Boulder

/**
 * MedianModel represents the core model for the Median screen, controlling Properties such as data sorting,
 * median visibility, and interactions with interactive cards. Also handles soccer scene dynamics
 * and ensures synchronization with UI components.
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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import InteractiveCardContainerModel from './InteractiveCardContainerModel.js';
import PreferencesModel from '../../../../joist/js/preferences/PreferencesModel.js';

type SelfOptions = EmptySelfOptions;
type MedianModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class MedianModel extends CAVModel {

  public readonly interactiveCardContainerModel: InteractiveCardContainerModel;
  public readonly isSortingDataProperty: BooleanProperty;
  public readonly medianVisibleProperty: BooleanProperty;
  public readonly areCardsSortedProperty: BooleanProperty;

  public constructor( preferencesModel: PreferencesModel, providedOptions: MedianModelOptions ) {

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
      CAVConstants.PHYSICAL_RANGE,
      CAVSoccerBall.createSoccerBall,

      // The regionAndCulturePortrayalProperty will not be undefined since portrayals were passed into the PreferencesModel at startup.
      preferencesModel.localizationModel.regionAndCulturePortrayalProperty!,
      { tandem: options.tandem.createTandem( 'sceneModel' ) }
    );

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
      tandem: accordionBoxTandem.createTandem( 'cardContainerModel' ), representationContext: 'accordion'
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