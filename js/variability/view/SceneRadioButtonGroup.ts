// Copyright 2023, University of Colorado Boulder

/**
 * Radio button group for the scene selection.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { Node, Path, Text } from '../../../../scenery/js/imports.js';
import tshirtSolidShape from '../../../../sherpa/js/fontawesome-5/tshirtSolidShape.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CAVSceneModel from '../../soccer-common/model/CAVSceneModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';

type SelfOptions = EmptySelfOptions;
type SceneRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class SceneRadioButtonGroup extends RectangularRadioButtonGroup<CAVSceneModel> {

  public constructor( sceneModels: VariabilitySceneModel[], property: Property<CAVSceneModel>, providedOptions: SceneRadioButtonGroupOptions ) {
    const options = optionize<SceneRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
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
        fontSize: 18,
        fontWeight: 'bold',
        fill: 'white',

        // Adjust for off-centering
        center: path.center.plusXY( -0.5, 0 ),
        stroke: 'black',
        lineWidth: 0.8
      } );
      return new Node( {
        children: [ path, text ]
      } );
    };

    super( property, [ {
      value: sceneModels[ 0 ],
      createNode: tandem => createTShirtIcon( tandem, '1', '#7bb772' ),
      tandemName: 'uniformRadioButton'
    }, {
      value: sceneModels[ 1 ],
      createNode: tandem => createTShirtIcon( tandem, '2', '#4f61b4' ),
      tandemName: 'gaussianRadioButton'
    }, {
      value: sceneModels[ 2 ],
      createNode: tandem => createTShirtIcon( tandem, '3', '#c15156' ),
      tandemName: 'skewedRadioButton'
    }, {
      value: sceneModels[ 3 ],
      createNode: tandem => createTShirtIcon( tandem, '4', '#eeda63' ),
      tandemName: 'bimodalRadioButton'
    } ], options );
  }
}

centerAndVariability.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );