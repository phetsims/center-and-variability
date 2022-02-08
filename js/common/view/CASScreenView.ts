// Copyright 2022, University of Colorado Boulder

/**
 * Base class for all ScreenViews in the sim.
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
import CASObjectType from '../model/CASObjectType.js';
import CASObject from '../model/CASObject.js';

export type CASScreenViewOptions = ScreenViewOptions;

class CASScreenView extends ScreenView {
  protected readonly resetAllButton: ResetAllButton;
  protected readonly modelViewTransform: ModelViewTransform2;
  protected model: CASModel;
  protected readonly objectsLayer: Node;

  constructor( model: CASModel, modelViewTransform: ModelViewTransform2, options: CASScreenViewOptions ) {
    options = optionize<CASScreenViewOptions>( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    this.modelViewTransform = modelViewTransform;
    this.model = model;

    const objectNodeGroup = new PhetioGroup( ( tandem, casObject ) => {
      return new CASObjectNode( casObject, modelViewTransform, {
        tandem: tandem
      } );
    }, [ model.objectGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( model.objectType === CASObjectType.SOCCER_BALL ? 'soccerBallNodeGroup' : 'dataPointNodeGroup' ),
      supportsDynamicState: false
    } );

    // Added by the child ScreenView so it is in the correct z-ordering TODO: question from CK: do we like this?
    this.objectsLayer = new Node();

    const map = new Map<CASObject, CASObjectNode>();

    const createObjectNode = ( casObject: CASObject ) => {
      const casObjectNode = objectNodeGroup.createCorrespondingGroupElement( casObject.tandem.name, casObject, {} );
      this.objectsLayer.addChild( casObjectNode );
      map.set( casObject, casObjectNode );
    };
    model.objectGroup.forEach( createObjectNode );
    model.objectGroup.elementCreatedEmitter.addListener( createObjectNode );

    model.objectGroup.elementDisposedEmitter.addListener( casObject => {
      const viewNode = map.get( casObject )!;
      objectNodeGroup.disposeElement( viewNode );
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