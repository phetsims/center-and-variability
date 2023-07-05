// Copyright 2022-2023, University of Colorado Boulder

/**
 * General simulation controls that globally change the presentation or behavior of the simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import { Text, Node, VBox, GridBox } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PlotType from '../model/PlotType.js';
import CAVConstants, { MAX_KICKS_PROPERTY, SHOW_OUTLIERS_PROPERTY } from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import MaxKicksComboBox from './MaxKicksComboBox.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

export default class SimulationPreferencesContentNode extends GridBox {

  public constructor( tandem: Tandem, parentNode: Node ) {

    const TITLE_TEXT_OPTIONS = {
      font: PreferencesDialog.PANEL_SECTION_LABEL_FONT
    };
    const LABEL_TEXT_OPTIONS = {
      font: new PhetFont( 14 )
    };
    const TITLE_MARGIN_BOTTOM = 10;

    const plotTypeTitle = new Text( CenterAndVariabilityStrings.plotTypeStringProperty, TITLE_TEXT_OPTIONS );
    const plotTypeDescription = new Text( CenterAndVariabilityStrings.plotTypeDescriptionStringProperty, LABEL_TEXT_OPTIONS );

    const plotTypeLabel = new VBox( { children: [ plotTypeTitle, plotTypeDescription ], align: 'left', spacing: TITLE_MARGIN_BOTTOM } );

    const plotTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      createNode: () => new Text( CenterAndVariabilityStrings.linePlotStringProperty, LABEL_TEXT_OPTIONS ),
      value: PlotType.LINE_PLOT,
      tandemName: 'linePlotRadioButton'
    }, {
      createNode: () => new Text( CenterAndVariabilityStrings.dotPlotStringProperty, LABEL_TEXT_OPTIONS ),
      value: PlotType.DOT_PLOT,
      tandemName: 'dotPlotRadioButton'
    } ], {
      tandem: tandem.createTandem( 'plotTypeRadioButtonGroup' )
    } );

    const maxKicksTitle = new Text( CenterAndVariabilityStrings.maxKicksStringProperty, TITLE_TEXT_OPTIONS );
    const maxKicksDescription1 = new Text( CenterAndVariabilityStrings.maxKicksDescription1StringProperty, LABEL_TEXT_OPTIONS );
    const maxKicksDescription2 = new Text( CenterAndVariabilityStrings.maxKicksDescription2StringProperty, LABEL_TEXT_OPTIONS );
    const maxKicksDescription = new VBox( { children: [ maxKicksDescription1, maxKicksDescription2 ], align: 'left', spacing: 20 } );
    const maxKicksLabel = new VBox( { children: [ maxKicksTitle, maxKicksDescription ], align: 'left', spacing: TITLE_MARGIN_BOTTOM } );

    const outliersTitle = new Text( CenterAndVariabilityStrings.outliersStringProperty, TITLE_TEXT_OPTIONS );
    const outliersDescription = new Text( CenterAndVariabilityStrings.outliersDescriptionStringProperty, LABEL_TEXT_OPTIONS );
    const outliersLabel = new VBox( { children: [ outliersTitle, outliersDescription ], align: 'left', spacing: TITLE_MARGIN_BOTTOM } );

    const outliersToggleSwitch = new ToggleSwitch( SHOW_OUTLIERS_PROPERTY, false, true, { tandem: tandem.createTandem( 'outliersToggleSwitch' ) } );

    // VBox is used to make it easy to add additional controls
    super( {
      ySpacing: 20,
      xAlign: 'left',
      rows: [
        [ plotTypeLabel, plotTypeRadioButtonGroup ],
        [ maxKicksLabel, new MaxKicksComboBox( MAX_KICKS_PROPERTY, parentNode, {
          tandem: tandem.createTandem( 'maxKicksComboBox' )
        } ) ],
        [ outliersLabel, outliersToggleSwitch ]
      ],
      spacing: PreferencesDialog.LABEL_CONTENT_SPACING,
      tandem: tandem
    } );
  }
}

centerAndVariability.register( 'SimulationPreferencesContentNode', SimulationPreferencesContentNode );