// Copyright 2023-2025, University of Colorado Boulder

/**
 * SceneKickerRadioButtonGroup provides radio buttons for users to select different scenes.
 * Each button showcases a t-shirt icon labeled with a scene number, facilitating easy scene selection.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import tshirtSolidShape from '../../../../sherpa/js/fontawesome-5/tshirtSolidShape.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilitySceneModel from '../model/VariabilitySceneModel.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

type SelfOptions = EmptySelfOptions;
type SceneKickerRadioButtonGroupOptions = SelfOptions & RectangularRadioButtonGroupOptions;

export default class SceneKickerRadioButtonGroup extends RectangularRadioButtonGroup<VariabilitySceneModel> {

  public constructor( sceneModels: VariabilitySceneModel[], property: Property<VariabilitySceneModel>, providedOptions: SceneKickerRadioButtonGroupOptions ) {
    const options = optionize<SceneKickerRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      radioButtonOptions: {
        baseColor: 'white'
      },
      isDisposable: false,
      touchAreaXDilation: 5,
      touchAreaYDilation: 4,
      accessibleName: CenterAndVariabilityFluent.a11y.variability.sceneRadioButtonGroup.groupNameStringProperty,
      accessibleHelpText: CenterAndVariabilityFluent.a11y.variability.sceneRadioButtonGroup.accessibleHelpTextStringProperty
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
          tandemName: `kicker${i + 1}RadioButton`,
          options: {
            accessibleName: sceneModel.accessibleName
          }
        };
      } ), options );
  }
}

centerAndVariability.register( 'SceneKickerRadioButtonGroup', SceneKickerRadioButtonGroup );