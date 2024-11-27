// Copyright 2023, University of Colorado Boulder

/**
 * SceneKickerRadioButtonGroup provides radio buttons for users to select different scenes.
 * Each button showcases a t-shirt icon labeled with a scene number, facilitating easy scene selection.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, Path, TColor, Text } from '../../../../scenery/js/imports.js';
import tshirtSolidShape from '../../../../sherpa/js/fontawesome-5/tshirtSolidShape.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import CAVSoccerSceneModel from '../../common/model/CAVSoccerSceneModel.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';

type SelfOptions = EmptySelfOptions;
type SceneKickerRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class SceneKickerRadioButtonGroup extends RectangularRadioButtonGroup<CAVSoccerSceneModel> {

  public constructor( sceneModels: VariabilitySceneModel[], property: Property<CAVSoccerSceneModel>, providedOptions: SceneKickerRadioButtonGroupOptions ) {
    const options = optionize<SceneKickerRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      radioButtonOptions: {
        baseColor: 'white'
      },
      isDisposable: false,
      touchAreaXDilation: 5,
      touchAreaYDilation: 4
    }, providedOptions );

    const createTShirtIcon = ( label: string, fill: TColor ) => {

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

    super( property,
      sceneModels.map( ( sceneModel, i ) => {
        return {
          value: sceneModel,
          createNode: () => createTShirtIcon( `${i + 1}`, sceneModel.kickerSceneColor ),
          tandemName: `kicker${i + 1}RadioButton`
        };
      } ), options );
  }
}

centerAndVariability.register( 'SceneKickerRadioButtonGroup', SceneKickerRadioButtonGroup );