// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import centerAndSpread from '../../centerAndSpread.js';
import CASModel from '../model/CASModel.js';
import CASConstants from '../CASConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import CASObjectNode from './CASObjectNode.js';
import { Node } from '../../../../scenery/js/imports.js';

export type CASScreenViewOptions = ScreenViewOptions;

class CASScreenView extends ScreenView {
  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;

  constructor( model: CASModel, modelViewTransform: ModelViewTransform2, options: CASScreenViewOptions ) {
    options = optionize<CASScreenViewOptions>( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    this.modelViewTransform = modelViewTransform;

    const objectNodeGroup = new PhetioGroup( ( tandem, casObject, modelViewTransform, options ) => {

      // TODO: Optionize please
      options.tandem = tandem;

      return new CASObjectNode( casObject, modelViewTransform, options );
    }, [ model.objectGroup.archetype, modelViewTransform, {} ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'objectNodeGroup' ),
      supportsDynamicState: false
    } );

    model.objectGroup.elementCreatedEmitter.addListener( casObject => {
      const casObjectNode = objectNodeGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject,
        modelViewTransform, {} );
      this.addChild( casObjectNode );
    } );

    // Added by the child ScreenView so it is in the correct z-ordering
    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - CASConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - CASConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
  }

  /**
   * Resets the view.
   */
  reset() {
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  step( dt: number ) {
  }
}

centerAndSpread.register( 'CASScreenView', CASScreenView );
export default CASScreenView;