// Copyright 2023, University of Colorado Boulder

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Node, Path, Text } from '../../../../scenery/js/imports.js';
import tshirtSolidShape from '../../../../sherpa/js/fontawesome-5/tshirtSolidShape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVSceneModel from '../../common/model/CAVSceneModel.js';

type SelfOptions = EmptySelfOptions;
type DistributionRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

// TODO: Rename to SceneRadioButtonGroup, see https://github.com/phetsims/center-and-variability/issues/164
export default class DistributionRadioButtonGroup extends RectangularRadioButtonGroup<CAVSceneModel> {

  public constructor( property: Property<CAVSceneModel>, providedOptions: DistributionRadioButtonGroupOptions ) {
    const options = optionize<DistributionRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      radioButtonOptions: {
        baseColor: 'white'
      }
    }, providedOptions );

    const createTShirtIcon = ( tandem: Tandem, label: string, fill: string ) => {

      const path = new Path( tshirtSolidShape, {
        fill: fill,
        stroke: 'black',
        lineWidth: 12,
        maxWidth: 35
      } );

      const text = new Text( label, {
        fontSize: 16,
        fontWeight: 'bold',
        fill: 'black',
        center: path.center
      } );
      return new Node( {
        children: [ path, text ]
      } );
    };
    super( property, [ {
      value: property.validValues![ 0 ],
      createNode: tandem => createTShirtIcon( tandem, '1', '#ec5f3a' ),
      tandemName: 'uniformRadioButton'
    }, {
      value: property.validValues![ 1 ],
      createNode: tandem => createTShirtIcon( tandem, '2', '#5bc760' ),
      tandemName: 'gaussianRadioButton'
    }, {
      value: property.validValues![ 2 ],
      createNode: tandem => createTShirtIcon( tandem, '3', '#fdf454' ),
      tandemName: 'skewedRadioButton'
    }, {

      // TODO: Be explicit about the possible scenes (don't pass through validValues), see https://github.com/phetsims/center-and-variability/issues/164
      value: property.validValues![ 3 ],
      createNode: tandem => createTShirtIcon( tandem, '4', '#9078e5' ),
      tandemName: 'bimodalRadioButton'
    } ], options );
  }
}

centerAndVariability.register( 'DistributionRadioButtonGroup', DistributionRadioButtonGroup );