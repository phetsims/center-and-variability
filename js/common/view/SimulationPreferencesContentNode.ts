// Copyright 2022-2025, University of Colorado Boulder

/**
 * SimulationPreferencesContentNode displays general controls that globally affect the presentation or behavior of the simulation.
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import timesSolidShape from '../../../../sherpa/js/fontawesome-5/timesSolidShape.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVColors from '../CAVColors.js';
import CAVConstants, { MAX_KICKS_PROPERTY, SHOW_OUTLIERS_PROPERTY } from '../CAVConstants.js';
import PlotType from '../model/PlotType.js';
import MaxKicksComboBox from './MaxKicksComboBox.js';
import PlotIcon, { VIEW_RADIUS } from './PlotIcon.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';

export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  public constructor( parentNode: Node, tandem: Tandem ) {

    const plotTypeTitle = new Text( CenterAndVariabilityStrings.plotTypeStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );

    const plotTypeControlTandem = tandem.createTandem( 'plotTypeControl' );

    const plotTypeRadioButtonGroup = new RectangularRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      createNode: () => new PlotIcon( timesSolidShape ),
      value: PlotType.LINE_PLOT,
      tandemName: 'linePlotRadioButton',
      options: {
        accessibleName: CenterAndVariabilityFluent.linePlotStringProperty
      }
    }, {
      createNode: () => new PlotIcon( Shape.circle( VIEW_RADIUS * 0.93 ) ),
      value: PlotType.DOT_PLOT,
      tandemName: 'dotPlotRadioButton',
      options: {
        accessibleName: CenterAndVariabilityFluent.dotPlotStringProperty
      }
    } ], {
      radioButtonOptions: {
        baseColor: CAVColors.radioButtonBackgroundColorProperty
      },
      orientation: 'horizontal',
      tandem: plotTypeControlTandem.createTandem( 'radioButtonGroup' ),
      isDisposable: false,
      accessibleHelpText: CenterAndVariabilityFluent.a11y.preferences.plotTypeRadioButtonGroup.accessibleHelpTextStringProperty,

      // Hide or show the entire row, not just the radio button
      phetioVisiblePropertyInstrumented: false
    } );

    const maxKicksTitle = new Text( CenterAndVariabilityStrings.maxKicksStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const maxKicksDescription = new RichText( CenterAndVariabilityStrings.maxKicksDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const plotTypeControl = new PreferencesControl( {
      labelNode: plotTypeTitle,
      controlNode: plotTypeRadioButtonGroup,
      tandem: plotTypeControlTandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
    const maxKicksControlTandem = tandem.createTandem( 'maxKicksControl' );
    const maxKicksControl = new PreferencesControl( {
      labelNode: maxKicksTitle,
      descriptionNode: maxKicksDescription,
      controlNode: new MaxKicksComboBox( MAX_KICKS_PROPERTY, parentNode, maxKicksControlTandem.createTandem( 'comboBox' ) ),
      tandem: maxKicksControlTandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    const outliersControlTandem = tandem.createTandem( 'outliersControl' );

    const outliersTitle = new Text( CenterAndVariabilityStrings.outliersStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const outliersDescription = new RichText( CenterAndVariabilityStrings.outliersDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const outliersSwitch = new ToggleSwitch( SHOW_OUTLIERS_PROPERTY, false, true, combineOptions<ToggleSwitchOptions>( {}, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS, {
      tandem: outliersControlTandem.createTandem( 'toggleSwitch' ),

      // Show or hide the entire row, not just the toggle switch
      phetioVisiblePropertyInstrumented: false
    } ) );
    const outliersControl = new PreferencesControl( {
      labelNode: outliersTitle,
      descriptionNode: outliersDescription,
      controlNode: outliersSwitch,
      tandem: outliersControlTandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
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