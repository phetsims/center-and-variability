// Copyright 2022, University of Colorado Boulder

/**
 * General simulation controls that globally change the presentation or behavior of the simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PlotType from '../model/PlotType.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';

class SimulationPreferencesContentNode extends VBox {
  private readonly disposeSimulationPreferencesContentNode: () => void;

  // TODO: Tandem in the options?  And use tandem in the file?
  public constructor( tandem: Tandem ) {

    const title = new Text( CenterAndVariabilityStrings.plotType, {
      font: PreferencesDialog.PANEL_SECTION_LABEL_FONT
    } );

    const TEXT_OPTIONS = {
      font: PreferencesDialog.CONTENT_FONT
    };
    const radioButtonGroup = new VerticalAquaRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      createNode: tandem => new Text( CenterAndVariabilityStrings.linePlot, TEXT_OPTIONS ),
      value: PlotType.LINE_PLOT,
      tandemName: 'linePlotRadioButton'
    }, {
      createNode: tandem => new Text( CenterAndVariabilityStrings.dotPlot, TEXT_OPTIONS ),
      value: PlotType.DOT_PLOT,
      tandemName: 'dotPlotRadioButton'
    } ], {
      tandem: tandem.createTandem( 'plotTypeRadioButtonGroup' )
    } );

    // VBox is used to make it easy to add additional controls
    super( {
      children: [ title, radioButtonGroup ],
      spacing: PreferencesDialog.LABEL_CONTENT_SPACING,
      align: 'left',
      tandem: tandem
    } );

    this.disposeSimulationPreferencesContentNode = () => radioButtonGroup.dispose();
  }

  public override dispose(): void {
    this.disposeSimulationPreferencesContentNode();
    super.dispose();
  }
}

centerAndVariability.register( 'SimulationPreferencesContentNode', SimulationPreferencesContentNode );
export default SimulationPreferencesContentNode;