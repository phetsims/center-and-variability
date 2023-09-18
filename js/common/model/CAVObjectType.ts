// Copyright 2022-2023, University of Colorado Boulder

/**
 * CAVObjectType is a property that describes whether a data-linked object is a soccer ball or a data point on a plot.
 * An object's type defines its radius as well as other factors that determine how it is represented visually.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import soccerCommon from '../../../../soccer-common/js/soccerCommon.js';
import SoccerCommonConstants from '../../../../soccer-common/js/SoccerCommonConstants.js';

export default class CAVObjectType extends EnumerationValue {
  public readonly radius: number;

  public static readonly SOCCER_BALL = new CAVObjectType( SoccerCommonConstants.SOCCER_BALL_RADIUS ); // In the play area
  public static readonly DATA_POINT = new CAVObjectType( 0.127 ); // In the charts

  public static readonly enumeration = new Enumeration( CAVObjectType );

  public constructor( radius: number ) {
    super();
    this.radius = radius;
  }
}

soccerCommon.register( 'CAVObjectType', CAVObjectType );