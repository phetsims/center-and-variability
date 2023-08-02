// Copyright 2023, University of Colorado Boulder

/**
 *
 * A collection of KickerImageSets. One KickerCharacterSet is active at a time. A different KickerCharacterSet can be selected
 * from preferences.
 *
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import CharacterSet from '../../../../joist/js/preferences/CharacterSet.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import soccerCommon from '../soccerCommon.js';
import { Image } from '../../../../scenery/js/imports.js';

export type KickerImageSet = {
  standing: HTMLImageElement;
  poisedToKick: HTMLImageElement;
  kicking: HTMLImageElement;
};

export default class KickerCharacterSet extends CharacterSet {

  public readonly unnumberedKickersCount: number;

  public constructor( headshot: HTMLImageElement, labelString: LocalizedStringProperty, public readonly unnumberedKickerImages: KickerImageSet[], public readonly numberedKickerImages: KickerImageSet[] ) {

    const headshotIcon = new Image( headshot, { scale: 0.35 } );
    super( headshotIcon, labelString );

    this.unnumberedKickersCount = unnumberedKickerImages.length;
  }
}

soccerCommon.register( 'KickerCharacterSet', KickerCharacterSet );