// Copyright 2022-2024, University of Colorado Boulder

/**
 * MedianModel represents the core model for the Median screen, controlling Properties such as data sorting,
 * median visibility, and interactions with interactive cards. Also handles soccer scene dynamics
 * and ensures synchronization with UI components.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import KickDistributionStrategy, { KickDistributionStrategySpecification } from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVConstants, { MAX_KICKS_PROPERTY } from '../../common/CAVConstants.js';
import CAVModel, { CAVModelOptions } from '../../common/model/CAVModel.js';
import CAVSoccerBall from '../../common/model/CAVSoccerBall.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import InteractiveCardContainerModel from './InteractiveCardContainerModel.js';

type SelfOptions = EmptySelfOptions;
type MedianModelOptions = SelfOptions & Pick<CAVModelOptions, 'tandem'>;

export default class MedianModel extends CAVModel {

  public readonly interactiveCardContainerModel: InteractiveCardContainerModel;
  public readonly isSortingDataProperty: BooleanProperty;
  public readonly medianVisibleProperty: BooleanProperty;
  public readonly areCardsSortedProperty: BooleanProperty;

  public constructor( providedOptions: MedianModelOptions ) {

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

    const kickDistributionStrategySpecification: KickDistributionStrategySpecification = {
      type: 'randomSkew',
      skewType: KickDistributionStrategy.chooseSkewDirection(),
      values: null
    };

    const sceneModelTandem = options.tandem.createTandem( 'sceneModel' );
    const kickDistributionStrategy = new KickDistributionStrategy(
      kickDistributionStrategySpecification.type,
      kickDistributionStrategySpecification.values,
      kickDistributionStrategySpecification.skewType, {
        rightSkewedData: [
          10, 25, 45, 30, 18,
          12, 10, 5, 4, 4,
          4, 4, 4, 4, 4
        ],
        probabilityByDistanceDocumentationValues: '[0,0,1,3,5,7,3,3,1,1,0,0,0,0,1]',
        distanceByIndexDocumentationValues: '[5,11,9,12,10,2,7,3,4,14,1,15,8,13,2,4,12,10,6,1,13,9,3,14,5,6,11,8,7,15]',
        valuesRange: CAVConstants.PHYSICAL_RANGE,
        maxKicks: maxKicksAllowed[ maxKicksAllowed.length - 1 ],
        tandem: sceneModelTandem.createTandem( 'kickDistributionStrategy' ),
        phetioFeatured: true
      } );

    const sceneModel = new CAVSoccerSceneModel(
      maxKicksProperty,
      maxKicksAllowed,
      kickDistributionStrategy,
      CAVConstants.PHYSICAL_RANGE,
      CAVSoccerBall.createSoccerBall,
      { tandem: sceneModelTandem }
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