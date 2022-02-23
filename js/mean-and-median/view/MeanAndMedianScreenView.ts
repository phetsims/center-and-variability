// Copyright 2022, University of Colorado Boulder

/**
 * ScreenView for the "Mean and Median" Screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import MeanAndMedianModel from '../model/MeanAndMedianModel.js';
import CASColors from '../../common/CASColors.js';
import centerAndSpreadStrings from '../../centerAndSpreadStrings.js';
import { ManualConstraint } from '../../../../scenery/js/imports.js';
import MeanOrMedianScreenView, { MeanOrMedianScreenViewOptions } from '../../common/view/MeanOrMedianScreenView.js';

type MeanAndMedianScreenViewOptions = MeanOrMedianScreenViewOptions;

class MeanAndMedianScreenView extends MeanOrMedianScreenView {

  constructor( model: MeanAndMedianModel, providedOptions: MeanAndMedianScreenViewOptions ) {

    const options = optionize<MeanAndMedianScreenViewOptions>( {
      // TODO: TypeScript is okay with not including isMedianScreen, why?
      isMedianScreen: false,
      questionBarOptions: {
        barFill: CASColors.meanAndMedianQuestionBarFillColorProperty,
        labelText: centerAndSpreadStrings.meanAndMedianQuestion
      },
      topCheckboxPanelOptions: {
        medianBarIconOptions: {
          notchDirection: 'down',
          barStyle: 'continuous'
        }
      },
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super( model, options );

    // TODO from CK: Just realized the number lines are close but not quite aligned
    ManualConstraint.create( this, [ this.playAreaNumberLineNode, this.accordionBoxContents ],
      ( lowerNumberLineWrapper, dotPlotNodeWrapper ) => {
        dotPlotNodeWrapper.left = lowerNumberLineWrapper.left;
      } );
  }
}

centerAndSpread.register( 'MeanAndMedianScreenView', MeanAndMedianScreenView );
export default MeanAndMedianScreenView;