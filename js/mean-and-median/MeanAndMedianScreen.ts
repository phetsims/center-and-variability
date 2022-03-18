// Copyright 2022, University of Colorado Boulder

/**
 * "Mean & Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import Tandem from '../../../tandem/js/Tandem.js';
import CAVColors from '../common/CAVColors.js';
import centerAndVariability from '../centerAndVariability.js';
import MeanAndMedianModel from './model/MeanAndMedianModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MeanAndMedianScreenView from './view/MeanAndMedianScreenView.js';
import centerAndVariabilityStrings from '../centerAndVariabilityStrings.js';

type MeanAndMedianScreenOptions = CAVScreenOptions;

class MeanAndMedianScreen extends CAVScreen<MeanAndMedianModel, MeanAndMedianScreenView> {

  constructor( providedOptions: MeanAndMedianScreenOptions ) {

    const options = optionize<MeanAndMedianScreenOptions, {}>( {
      name: centerAndVariabilityStrings.screen.meanAndMedian,
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty,
      tandem: Tandem.REQUIRED
    }, providedOptions );

    super(
      () => new MeanAndMedianModel( {
        includeCards: false,
        tandem: options.tandem.createTandem( 'model' ),
        instrumentMeanPredictionProperty: true
      } ),
      // @ts-ignore What is happening here?
      model => new MeanAndMedianScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

centerAndVariability.register( 'MeanAndMedianScreen', MeanAndMedianScreen );
export default MeanAndMedianScreen;