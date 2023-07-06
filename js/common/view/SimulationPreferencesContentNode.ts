// Copyright 2022-2023, University of Colorado Boulder

/**
 * General simulation controls that globally change the presentation or behavior of the simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import PlotType from '../model/PlotType.js';
import CAVConstants, { MAX_KICKS_PROPERTY, SHOW_OUTLIERS_PROPERTY } from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MaxKicksComboBox from './MaxKicksComboBox.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const RADIO_BUTTON_LABEL_OPTIONS = {
  font: new PhetFont( 16 )
};
export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  public constructor( parentNode: Node ) {

    const plotTypeTitle = new Text( CenterAndVariabilityStrings.plotTypeStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const plotTypeDescription = new RichText( CenterAndVariabilityStrings.plotTypeDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const plotTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      createNode: () => new Text( CenterAndVariabilityStrings.linePlotStringProperty, RADIO_BUTTON_LABEL_OPTIONS ),
      value: PlotType.LINE_PLOT
    }, {
      createNode: () => new Text( CenterAndVariabilityStrings.dotPlotStringProperty, RADIO_BUTTON_LABEL_OPTIONS ),
      value: PlotType.DOT_PLOT
    } ], {

      // We don't want to instrument components for preferences, https://github.com/phetsims/joist/issues/744#issuecomment-1196028362
      tandem: Tandem.OPT_OUT
    } );

    const maxKicksTitle = new Text( CenterAndVariabilityStrings.maxKicksStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const maxKicksDescription = new RichText( CenterAndVariabilityStrings.maxKicksDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const outliersTitle = new Text( CenterAndVariabilityStrings.outliersStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const outliersDescription = new RichText( CenterAndVariabilityStrings.outliersDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const outliersSwitch = new ToggleSwitch( SHOW_OUTLIERS_PROPERTY, false, true, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS );

    const plotTypeControl = new PreferencesControl( {
      labelNode: plotTypeTitle,
      descriptionNode: plotTypeDescription,
      controlNode: plotTypeRadioButtonGroup
    } );
    const maxKicksControl = new PreferencesControl( {
      labelNode: maxKicksTitle,
      descriptionNode: maxKicksDescription,
      controlNode: new MaxKicksComboBox( MAX_KICKS_PROPERTY, parentNode )
    } );

    const outliersControl = new PreferencesControl( {
      labelNode: outliersTitle,
      descriptionNode: outliersDescription,
      controlNode: outliersSwitch
    } );

    super( {
      fill: 'white',
      content: [
        plotTypeControl, maxKicksControl, outliersControl
      ]
    } );
  }
}

centerAndVariability.register( 'SimulationPreferencesContentNode', SimulationPreferencesContentNode );