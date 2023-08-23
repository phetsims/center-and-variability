// Copyright 2022-2023, University of Colorado Boulder

/**
 * General simulation controls that globally change the presentation or behavior of the simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import PlotType from '../model/PlotType.js';
import CAVConstants, { MAX_KICKS_PROPERTY, SHOW_OUTLIERS_PROPERTY } from '../CAVConstants.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import MaxKicksComboBox from './MaxKicksComboBox.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import PlotIcon, { VIEW_RADIUS } from './PlotIcon.js';
import CAVColors from '../CAVColors.js';
import { Shape } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  public constructor( parentNode: Node, tandem: Tandem ) {

    const plotTypeTitle = new Text( CenterAndVariabilityStrings.plotTypeStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );

    const plotTypeRadioButtonGroup = new RectangularRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      createNode: () => new PlotIcon( timesSolidShape ),
      value: PlotType.LINE_PLOT,
      tandemName: 'linePlotRadioButton'
    }, {
      createNode: () => new PlotIcon( Shape.circle( VIEW_RADIUS * 0.93 ) ),
      value: PlotType.DOT_PLOT,
      tandemName: 'dotPlotRadioButton'
    } ], {
      radioButtonOptions: {
        baseColor: CAVColors.radioButtonBackgroundColorProperty
      },
      orientation: 'horizontal',
      tandem: tandem.createTandem( 'plotTypeRadioButtonGroup' ),
      isDisposable: false
    } );

    const maxKicksTitle = new Text( CenterAndVariabilityStrings.maxKicksStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const maxKicksDescription = new RichText( CenterAndVariabilityStrings.maxKicksDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const outliersTitle = new Text( CenterAndVariabilityStrings.outliersStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const outliersDescription = new RichText( CenterAndVariabilityStrings.outliersDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const outliersSwitch = new ToggleSwitch( SHOW_OUTLIERS_PROPERTY, false, true, combineOptions<ToggleSwitchOptions>( {
      tandem: tandem.createTandem( 'outliersSwitch' )
    }, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS ) );

    const plotTypeControl = new PreferencesControl( {
      labelNode: plotTypeTitle,
      controlNode: plotTypeRadioButtonGroup,
      tandem: tandem.createTandem( 'plotTypeControl' )
    } );
    const maxKicksControl = new PreferencesControl( {
      labelNode: maxKicksTitle,
      descriptionNode: maxKicksDescription,
      controlNode: new MaxKicksComboBox( MAX_KICKS_PROPERTY, parentNode ),
      tandem: tandem.createTandem( 'maxKicksControl' )
    } );

    const outliersControl = new PreferencesControl( {
      labelNode: outliersTitle,
      descriptionNode: outliersDescription,
      controlNode: outliersSwitch,
      tandem: tandem.createTandem( 'outliersControl' )
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