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
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';

type SelfOptions = EmptySelfOptions;
type SceneKickerRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class SceneKickerRadioButtonGroup extends RectangularRadioButtonGroup<CAVSoccerSceneModel> {

  public constructor( sceneModels: VariabilitySceneModel[], property: Property<CAVSoccerSceneModel>, providedOptions: SceneKickerRadioButtonGroupOptions ) {
    const options = optionize<SceneKickerRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      radioButtonOptions: {
        baseColor: 'white'
      },
      isDisposable: false
    }, providedOptions );

    const createTShirtIcon = ( label: string, fill: string ) => {

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
      createNode: tandem => createTShirtIcon( '1', '#7bb772' ),
      tandemName: 'kicker1RadioButton'
    }, {
      value: sceneModels[ 1 ],
      createNode: tandem => createTShirtIcon( '2', '#4f61b4' ),
      tandemName: 'kicker2RadioButton'
    }, {
      value: sceneModels[ 2 ],
      createNode: tandem => createTShirtIcon( '3', '#c15156' ),
      tandemName: 'kicker3RadioButton'
    }, {
      value: sceneModels[ 3 ],
      createNode: tandem => createTShirtIcon( '4', '#eeda63' ),
      tandemName: 'kicker4RadioButton'
    } ], options );
  }
}

centerAndVariability.register( 'SceneKickerRadioButtonGroup', SceneKickerRadioButtonGroup );