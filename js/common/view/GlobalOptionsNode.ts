// Copyright 2015-2021, University of Colorado Boulder

/**
 * Global options shown in the "Options" dialog from the PhET Menu
 *
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import OptionsDialog from '../../../../joist/js/OptionsDialog.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import { VBox, Text } from '../../../../scenery/js/imports.js';
import centerAndSpread from '../../centerAndSpread.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PlotType from '../model/PlotType.js';
import CASConstants from '../CASConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';

class GlobalOptionsNode extends VBox {
  private disposeGlobalOptionsNode: () => void;

  // TODO: Tandem in the options?  And use tandem in the file?
  constructor( tandem: Tandem ) {

    const title = new Text( centerAndSpreadStrings.plotType, {
      font: new PhetFont( 24 )
    } );

    const TEXT_OPTIONS = {
      font: new PhetFont( 18 )
    };
    const radioButtonGroup = new VerticalAquaRadioButtonGroup<PlotType>( CASConstants.PLOT_TYPE_PROPERTY, [ {
      node: new Text( centerAndSpreadStrings.linePlot, TEXT_OPTIONS ),
      value: PlotType.LINE_PLOT
    }, {
      node: new Text( centerAndSpreadStrings.dotPlot, TEXT_OPTIONS ),
      value: PlotType.DOT_PLOT
    } ] );

    // VBox is used to make it easy to add additional options
    super( {
      children: [ title, radioButtonGroup ],
      spacing: OptionsDialog.DEFAULT_SPACING,
      align: 'left'
    } );

    this.disposeGlobalOptionsNode = () => radioButtonGroup.dispose();
  }

  dispose() {
    this.disposeGlobalOptionsNode();
    super.dispose();
  }
}

centerAndSpread.register( 'GlobalOptionsNode', GlobalOptionsNode );
export default GlobalOptionsNode;