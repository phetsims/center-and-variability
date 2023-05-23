// Copyright 2022-2023, University of Colorado Boulder

/**
 * General simulation controls that globally change the presentation or behavior of the simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import { Text, VBox, Node } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PlotType from '../model/PlotType.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import CAVConstants from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import MaxKicksControlNode from './MaxKicksControlNode.js';

export default class SimulationPreferencesContentNode extends VBox {
  private readonly disposeSimulationPreferencesContentNode: () => void;

  public constructor( tandem: Tandem, parentNode: Node ) {

    const title = new Text( CenterAndVariabilityStrings.plotTypeStringProperty, {
      font: PreferencesDialog.PANEL_SECTION_LABEL_FONT
    } );

    const TEXT_OPTIONS = {
      font: PreferencesDialog.CONTENT_FONT,
      maxWidth: PreferencesDialog.CONTENT_MAX_WIDTH
    };
    const radioButtonGroup = new VerticalAquaRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      createNode: () => new Text( CenterAndVariabilityStrings.linePlotStringProperty, TEXT_OPTIONS ),
      value: PlotType.LINE_PLOT,
      tandemName: 'linePlotRadioButton'
    }, {
      createNode: () => new Text( CenterAndVariabilityStrings.dotPlotStringProperty, TEXT_OPTIONS ),
      value: PlotType.DOT_PLOT,
      tandemName: 'dotPlotRadioButton'
    } ], {
      tandem: tandem.createTandem( 'plotTypeRadioButtonGroup' )
    } );

    const outliersCheckbox = new Checkbox( CAVConstants.SHOW_OUTLIERS_PROPERTY, new Text( CenterAndVariabilityStrings.showOutliersBoxplotOnlyStringProperty, TEXT_OPTIONS ), {
      tandem: tandem.createTandem( 'outliersCheckbox' )
    } );

    // VBox is used to make it easy to add additional controls
    super( {
      children: [ title, radioButtonGroup, outliersCheckbox, new MaxKicksControlNode( CAVConstants.MAX_KICKS_PROPERTY, parentNode, {
        tandem: tandem.createTandem( 'maxKicksControlNode' )
      } ) ],
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