// Copyright 2022, University of Colorado Boulder

/**
 * Global options shown in the "Options" dialog from the PhET Menu
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
import centerAndVariabilityStrings from '../../centerAndVariabilityStrings.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';

class GlobalOptionsNode extends VBox {
  private readonly disposeGlobalOptionsNode: () => void;

  // TODO: Tandem in the options?  And use tandem in the file?
  public constructor( tandem: Tandem ) {

    const title = new Text( centerAndVariabilityStrings.plotType, {
      font: PreferencesDialog.TITLE_FONT
    } );

    const TEXT_OPTIONS = {
      font: PreferencesDialog.CONTENT_FONT
    };
    const radioButtonGroup = new VerticalAquaRadioButtonGroup<PlotType>( CAVConstants.PLOT_TYPE_PROPERTY, [ {
      node: new Text( centerAndVariabilityStrings.linePlot, TEXT_OPTIONS ),
      value: PlotType.LINE_PLOT,
      tandemName: 'linePlotRadioButton'
    }, {
      node: new Text( centerAndVariabilityStrings.dotPlot, TEXT_OPTIONS ),
      value: PlotType.DOT_PLOT,
      tandemName: 'dotPlotRadioButton'
    } ], {
      tandem: tandem.createTandem( 'plotTypeRadioButtonGroup' )
    } );

    // VBox is used to make it easy to add additional options
    super( {
      children: [ title, radioButtonGroup ],
      spacing: PreferencesDialog.CONTENT_SPACING,
      align: 'left',
      tandem: tandem
    } );

    this.disposeGlobalOptionsNode = () => radioButtonGroup.dispose();
  }

  public override dispose(): void {
    this.disposeGlobalOptionsNode();
    super.dispose();
  }
}

centerAndVariability.register( 'GlobalOptionsNode', GlobalOptionsNode );
export default GlobalOptionsNode;