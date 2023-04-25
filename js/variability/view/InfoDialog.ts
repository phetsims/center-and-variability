// Copyright 2023, University of Colorado Boulder

import { Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';
import VariabilityModel from '../model/VariabilityModel.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import VariabilityMeasure from '../model/VariabilityMeasure.js';
import RangeInfoNode from './RangeInfoNode.js';

export default class InfoDialog extends Dialog {
  public constructor( model: VariabilityModel, chartViewWidth: number, options: DialogOptions ) {

    const content = new ToggleNode( model.selectedVariabilityProperty, [ {
      value: VariabilityMeasure.RANGE,
      createNode: tandem => new RangeInfoNode( model, chartViewWidth, { tandem: tandem } )
    }, {
      value: VariabilityMeasure.IQR,
      createNode: tandem => {
        return new Text( 'IQR' );
      }
    }, {
      value: VariabilityMeasure.MAD,
      createNode: tandem => {
        return new Text( 'IQR' );
      }
    } ] );

    super( content, {

      // TODO: It seems there are 2 ways to hide the dialog. Is there a better way?
      hideCallback: () => model.isInfoShowingProperty.set( false )
    } );
  }
}

centerAndVariability.register( 'InfoDialog', InfoDialog );