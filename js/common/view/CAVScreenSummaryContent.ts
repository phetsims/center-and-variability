// Copyright 2025, University of Colorado Boulder
/**
 * Consolidates the common aspects of screen summaries for the Center and Variability simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ScreenSummaryContent, { ScreenSummaryContentOptions, SectionContent } from '../../../../joist/js/ScreenSummaryContent.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import CAVConstants from '../CAVConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';

type SelfOptions = EmptySelfOptions;
type CAVScreenSummaryContentOptions = SelfOptions & WithRequired<ScreenSummaryContentOptions, 'playAreaContent' | 'interactionHintContent'>;
export default class CAVScreenSummaryContent extends ScreenSummaryContent {
  protected static readonly METERS = _.range( CAVConstants.PHYSICAL_RANGE.min, CAVConstants.PHYSICAL_RANGE.max + 1 );

  protected constructor(
    meterStackHeightProperties: TReadOnlyProperty<number>[],
    currentDetailsStringProperty: TReadOnlyProperty<string>,
    remainingDetailsNode: Node,
    providedOptions: CAVScreenSummaryContentOptions ) {

    const listItems = CAVScreenSummaryContent.METERS.map( meter => {
      const index = meter - CAVConstants.PHYSICAL_RANGE.min;
      return new Node( {
        tagName: 'li',
        visibleProperty: DerivedProperty.valueNotEqualsConstant( meterStackHeightProperties[ index ], 0 ),
        accessibleName: CenterAndVariabilityFluent.a11y.common.currentDetails.listItemPattern.createProperty( {
          number: meterStackHeightProperties[ index ],
          distance: meter
        } )
      } );
    } );

    const currentDetailsNode = new Node( {
      children: [
        new Node( {
          tagName: 'p',
          accessibleName: currentDetailsStringProperty
        } ),
        new Node( {
          tagName: 'ul',
          children: listItems
        } ),
        remainingDetailsNode
      ]
    } );

    const options = optionize<CAVScreenSummaryContentOptions, SelfOptions, ScreenSummaryContentOptions>()( {
      controlAreaContent: CenterAndVariabilityStrings.a11y.median.controlAreaStringProperty,
      currentDetailsContent: {
        node: currentDetailsNode
      }
    }, providedOptions );

    super( options );
  }

  protected static createInteractionHintContent(
    someBallsStringProperty: TReadOnlyProperty<string>,
    stackSoccerBallCountProperty: TReadOnlyProperty<number> ): SectionContent {
    return new DynamicProperty<string, string, TReadOnlyProperty<string>>(
      new DerivedProperty( [ stackSoccerBallCountProperty ], count => {
        return count === 0 ? CenterAndVariabilityStrings.a11y.common.interactionHintNoBallsStringProperty :
               someBallsStringProperty;
      } ) );
  }
}

centerAndVariability.register( 'CAVScreenSummaryContent', CAVScreenSummaryContent );