// Copyright 2022-2023, University of Colorado Boulder

/**
 * "Mean & Median" screen
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import CAVColors from '../common/CAVColors.js';
import centerAndVariability from '../centerAndVariability.js';
import MeanAndMedianModel from './model/MeanAndMedianModel.js';
import CAVScreen, { CAVScreenOptions } from '../common/CAVScreen.js';
import MeanAndMedianScreenView from './view/MeanAndMedianScreenView.js';
import CenterAndVariabilityStrings from '../CenterAndVariabilityStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import meanAndMedianScreenIcon_png from '../../images/meanAndMedianScreenIcon_png.js';
import DynamicProperty from '../../../axon/js/DynamicProperty.js';
import CAVConstants from '../common/CAVConstants.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import PlotType from '../common/model/PlotType.js';
import TopRepresentationCheckboxGroup from '../common/view/TopRepresentationCheckboxGroup.js';

type MeanAndMedianScreenOptions = CAVScreenOptions;

export default class MeanAndMedianScreen extends CAVScreen<MeanAndMedianModel, MeanAndMedianScreenView> {

  public constructor( providedOptions: MeanAndMedianScreenOptions ) {

    const options = optionize<MeanAndMedianScreenOptions, EmptySelfOptions, CAVScreenOptions>()( {
      name: CenterAndVariabilityStrings.screen.meanAndMedianStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( meanAndMedianScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      backgroundColorProperty: CAVColors.screenBackgroundColorProperty
    }, providedOptions );

    const currentProperty = new DerivedProperty( [ CAVConstants.PLOT_TYPE_PROPERTY ], plotType => {
      return plotType === PlotType.LINE_PLOT ? CenterAndVariabilityStrings.linePlotStringProperty :
             CenterAndVariabilityStrings.dotPlotStringProperty;
    } );

    const accordionBoxTitleProperty = new DynamicProperty<string, unknown, unknown>( currentProperty );

    super(
      () => new MeanAndMedianModel( {
        includeCards: false,
        tandem: options.tandem.createTandem( 'model' ),
        instrumentMeanPredictionProperty: true,
        dataPointFill: 'black'
      } ),
      model => new MeanAndMedianScreenView( model, {
        isVariabilityScreen: false,
        tandem: options.tandem.createTandem( 'view' ),
        accordionBoxTitleStringProperty: accordionBoxTitleProperty,
        createAccordionBoxControlNode: tandem => new TopRepresentationCheckboxGroup( model, {
          medianBarIconOptions: {
            notchDirection: 'down',
            barStyle: 'continuous',
            arrowScale: 0.75
          },
          showMedianCheckboxIcon: true,
          tandem: tandem.createTandem( 'topRepresentationCheckboxGroup' )
        } )
      } ),
      options
    );
  }
}

centerAndVariability.register( 'MeanAndMedianScreen', MeanAndMedianScreen );