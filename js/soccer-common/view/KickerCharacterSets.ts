// Copyright 2023, University of Colorado Boulder
/**
 * Responsible for all images for the Kicker in this sim. Collects the images into usable classes to support
 * animation, and selecting a different set of kicker characters for
 * localization.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import soccerCommon from '../soccerCommon.js';
import kicker1_set1_headshot_TEMP_png from '../../../images/kicker1_set1_headshot_TEMP_png.js';
import SoccerCommonStrings from '../SoccerCommonStrings.js';
import player01Kicking_png from '../../../images/player01Kicking_png.js';
import player01Standing_png from '../../../images/player01Standing_png.js';
import player01PoisedToKick_png from '../../../images/player01PoisedToKick_png.js';
import player02Standing_png from '../../../images/player02Standing_png.js';
import player02PoisedToKick_png from '../../../images/player02PoisedToKick_png.js';
import player02Kicking_png from '../../../images/player02Kicking_png.js';
import player03Standing_png from '../../../images/player03Standing_png.js';
import player03PoisedToKick_png from '../../../images/player03PoisedToKick_png.js';
import player03Kicking_png from '../../../images/player03Kicking_png.js';
import player04Standing_png from '../../../images/player04Standing_png.js';
import player04PoisedToKick_png from '../../../images/player04PoisedToKick_png.js';
import player04Kicking_png from '../../../images/player04Kicking_png.js';
import player05Standing_png from '../../../images/player05Standing_png.js';
import player05PoisedToKick_png from '../../../images/player05PoisedToKick_png.js';
import player05Kicking_png from '../../../images/player05Kicking_png.js';
import player06Standing_png from '../../../images/player06Standing_png.js';
import player06PoisedToKick_png from '../../../images/player06PoisedToKick_png.js';
import player06Kicking_png from '../../../images/player06Kicking_png.js';
import player07Standing_png from '../../../images/player07Standing_png.js';
import player07PoisedToKick_png from '../../../images/player07PoisedToKick_png.js';
import player07Kicking_png from '../../../images/player07Kicking_png.js';
import player08Standing_png from '../../../images/player08Standing_png.js';
import player08PoisedToKick_png from '../../../images/player08PoisedToKick_png.js';
import player08Kicking_png from '../../../images/player08Kicking_png.js';
import player09Standing_png from '../../../images/player09Standing_png.js';
import player09PoisedToKick_png from '../../../images/player09PoisedToKick_png.js';
import player09Kicking_png from '../../../images/player09Kicking_png.js';
import player10Standing_png from '../../../images/player10Standing_png.js';
import player10PoisedToKick_png from '../../../images/player10PoisedToKick_png.js';
import player10Kicking_png from '../../../images/player10Kicking_png.js';
import player11Standing_png from '../../../images/player11Standing_png.js';
import player11PoisedToKick_png from '../../../images/player11PoisedToKick_png.js';
import player11Kicking_png from '../../../images/player11Kicking_png.js';
import player12Standing_png from '../../../images/player12Standing_png.js';
import player12PoisedToKick_png from '../../../images/player12PoisedToKick_png.js';
import player12Kicking_png from '../../../images/player12Kicking_png.js';
import player13Standing_png from '../../../images/player13Standing_png.js';
import player13PoisedToKick_png from '../../../images/player13PoisedToKick_png.js';
import player13Kicking_png from '../../../images/player13Kicking_png.js';
import player14Standing_png from '../../../images/player14Standing_png.js';
import player14PoisedToKick_png from '../../../images/player14PoisedToKick_png.js';
import player14Kicking_png from '../../../images/player14Kicking_png.js';
import player15Standing_png from '../../../images/player15Standing_png.js';
import player15PoisedToKick_png from '../../../images/player15PoisedToKick_png.js';
import player15Kicking_png from '../../../images/player15Kicking_png.js';
import kicker1_set2_headshot_TEMP_png from '../../../images/kicker1_set2_headshot_TEMP_png.js';
import kicker1_set3_headshot_TEMP_png from '../../../images/kicker1_set3_headshot_TEMP_png.js';
import KickerCharacterSet from './KickerCharacterSet.js';
import variabilityPlayer01Standing_png from '../../../images/variabilityPlayer01Standing_png.js';
import variabilityPlayer01PoisedToKick_png from '../../../images/variabilityPlayer01PoisedToKick_png.js';
import variabilityPlayer01Kicking_png from '../../../images/variabilityPlayer01Kicking_png.js';
import variabilityPlayer02Standing_png from '../../../images/variabilityPlayer02Standing_png.js';
import variabilityPlayer02Kicking_png from '../../../images/variabilityPlayer02Kicking_png.js';
import variabilityPlayer02PoisedToKick_png from '../../../images/variabilityPlayer02PoisedToKick_png.js';
import variabilityPlayer03Standing_png from '../../../images/variabilityPlayer03Standing_png.js';
import variabilityPlayer03PoisedToKick_png from '../../../images/variabilityPlayer03PoisedToKick_png.js';
import variabilityPlayer03Kicking_png from '../../../images/variabilityPlayer03Kicking_png.js';
import variabilityPlayer04Kicking_png from '../../../images/variabilityPlayer04Kicking_png.js';
import variabilityPlayer04Standing_png from '../../../images/variabilityPlayer04Standing_png.js';
import variabilityPlayer04PoisedToKick_png from '../../../images/variabilityPlayer04PoisedToKick_png.js';

const unitedStatesOfAmericaStringProperty = SoccerCommonStrings.characterSet.unitedStatesOfAmericaStringProperty;
const africaStringProperty = SoccerCommonStrings.characterSet.africaStringProperty;
const africaConservativeStringProperty = SoccerCommonStrings.characterSet.africaModestStringProperty;

const CHARACTER_SET_1 = new KickerCharacterSet(
  kicker1_set1_headshot_TEMP_png,
  unitedStatesOfAmericaStringProperty,
  [
    {
      standing: player01Standing_png,
      poisedToKick: player01PoisedToKick_png,
      kicking: player01Kicking_png
    },
    {
      standing: player02Standing_png,
      poisedToKick: player02PoisedToKick_png,
      kicking: player02Kicking_png
    },
    {
      standing: player03Standing_png,
      poisedToKick: player03PoisedToKick_png,
      kicking: player03Kicking_png
    },
    {
      standing: player04Standing_png,
      poisedToKick: player04PoisedToKick_png,
      kicking: player04Kicking_png
    },
    {
      standing: player05Standing_png,
      poisedToKick: player05PoisedToKick_png,
      kicking: player05Kicking_png
    },
    {
      standing: player06Standing_png,
      poisedToKick: player06PoisedToKick_png,
      kicking: player06Kicking_png
    },
    {
      standing: player07Standing_png,
      poisedToKick: player07PoisedToKick_png,
      kicking: player07Kicking_png
    },
    {
      standing: player08Standing_png,
      poisedToKick: player08PoisedToKick_png,
      kicking: player08Kicking_png
    },
    {
      standing: player09Standing_png,
      poisedToKick: player09PoisedToKick_png,
      kicking: player09Kicking_png
    },
    {
      standing: player10Standing_png,
      poisedToKick: player10PoisedToKick_png,
      kicking: player10Kicking_png
    },
    {
      standing: player11Standing_png,
      poisedToKick: player11PoisedToKick_png,
      kicking: player11Kicking_png
    },
    {
      standing: player12Standing_png,
      poisedToKick: player12PoisedToKick_png,
      kicking: player12Kicking_png
    },
    {
      standing: player13Standing_png,
      poisedToKick: player13PoisedToKick_png,
      kicking: player13Kicking_png
    },
    {
      standing: player14Standing_png,
      poisedToKick: player14PoisedToKick_png,
      kicking: player14Kicking_png
    },
    {
      standing: player15Standing_png,
      poisedToKick: player15PoisedToKick_png,
      kicking: player15Kicking_png
    }
  ],
  [
    {
      standing: variabilityPlayer01Standing_png,
      poisedToKick: variabilityPlayer01PoisedToKick_png,
      kicking: variabilityPlayer01Kicking_png
    },
    {
      standing: variabilityPlayer02Standing_png,
      poisedToKick: variabilityPlayer02PoisedToKick_png,
      kicking: variabilityPlayer02Kicking_png
    },
    {
      standing: variabilityPlayer03Standing_png,
      poisedToKick: variabilityPlayer03PoisedToKick_png,
      kicking: variabilityPlayer03Kicking_png
    },
    {
      standing: variabilityPlayer04Standing_png,
      poisedToKick: variabilityPlayer04PoisedToKick_png,
      kicking: variabilityPlayer04Kicking_png
    }
  ]
);

const CHARACTER_SET_2 = new KickerCharacterSet(
  kicker1_set2_headshot_TEMP_png,
  africaStringProperty,
  [
    {
      standing: player01Standing_png,
      poisedToKick: player01PoisedToKick_png,
      kicking: player01Kicking_png
    },
    {
      standing: player02Standing_png,
      poisedToKick: player02PoisedToKick_png,
      kicking: player02Kicking_png
    },
    {
      standing: player03Standing_png,
      poisedToKick: player03PoisedToKick_png,
      kicking: player03Kicking_png
    },
    {
      standing: player04Standing_png,
      poisedToKick: player04PoisedToKick_png,
      kicking: player04Kicking_png
    },
    {
      standing: player05Standing_png,
      poisedToKick: player05PoisedToKick_png,
      kicking: player05Kicking_png
    },
    {
      standing: player06Standing_png,
      poisedToKick: player06PoisedToKick_png,
      kicking: player06Kicking_png
    },
    {
      standing: player07Standing_png,
      poisedToKick: player07PoisedToKick_png,
      kicking: player07Kicking_png
    },
    {
      standing: player08Standing_png,
      poisedToKick: player08PoisedToKick_png,
      kicking: player08Kicking_png
    },
    {
      standing: player09Standing_png,
      poisedToKick: player09PoisedToKick_png,
      kicking: player09Kicking_png
    }
  ],
  [
    {
      standing: variabilityPlayer01Standing_png,
      poisedToKick: variabilityPlayer01PoisedToKick_png,
      kicking: variabilityPlayer01Kicking_png
    },
    {
      standing: variabilityPlayer02Standing_png,
      poisedToKick: variabilityPlayer02PoisedToKick_png,
      kicking: variabilityPlayer02Kicking_png
    },
    {
      standing: variabilityPlayer03Standing_png,
      poisedToKick: variabilityPlayer03PoisedToKick_png,
      kicking: variabilityPlayer03Kicking_png
    },
    {
      standing: variabilityPlayer04Standing_png,
      poisedToKick: variabilityPlayer04PoisedToKick_png,
      kicking: variabilityPlayer04Kicking_png
    }
  ]
);

const CHARACTER_SET_3 = new KickerCharacterSet(
  kicker1_set3_headshot_TEMP_png,
  africaConservativeStringProperty,
  [
    {
      standing: player01Standing_png,
      poisedToKick: player01PoisedToKick_png,
      kicking: player01Kicking_png
    },
    {
      standing: player02Standing_png,
      poisedToKick: player02PoisedToKick_png,
      kicking: player02Kicking_png
    },
    {
      standing: player03Standing_png,
      poisedToKick: player03PoisedToKick_png,
      kicking: player03Kicking_png
    },
    {
      standing: player04Standing_png,
      poisedToKick: player04PoisedToKick_png,
      kicking: player04Kicking_png
    },
    {
      standing: player05Standing_png,
      poisedToKick: player05PoisedToKick_png,
      kicking: player05Kicking_png
    },
    {
      standing: player06Standing_png,
      poisedToKick: player06PoisedToKick_png,
      kicking: player06Kicking_png
    },
    {
      standing: player07Standing_png,
      poisedToKick: player07PoisedToKick_png,
      kicking: player07Kicking_png
    },
    {
      standing: player08Standing_png,
      poisedToKick: player08PoisedToKick_png,
      kicking: player08Kicking_png
    },
    {
      standing: player09Standing_png,
      poisedToKick: player09PoisedToKick_png,
      kicking: player09Kicking_png
    },
    {
      standing: player10Standing_png,
      poisedToKick: player10PoisedToKick_png,
      kicking: player10Kicking_png
    }
  ],
  [
    {
      standing: variabilityPlayer01Standing_png,
      poisedToKick: variabilityPlayer01PoisedToKick_png,
      kicking: variabilityPlayer01Kicking_png
    },
    {
      standing: variabilityPlayer02Standing_png,
      poisedToKick: variabilityPlayer02PoisedToKick_png,
      kicking: variabilityPlayer02Kicking_png
    },
    {
      standing: variabilityPlayer03Standing_png,
      poisedToKick: variabilityPlayer03PoisedToKick_png,
      kicking: variabilityPlayer03Kicking_png
    },
    {
      standing: variabilityPlayer04Standing_png,
      poisedToKick: variabilityPlayer04PoisedToKick_png,
      kicking: variabilityPlayer04Kicking_png
    }
  ]
);

const KickerCharacterSets = {
  CHARACTER_SETS: [ CHARACTER_SET_1, CHARACTER_SET_2, CHARACTER_SET_3 ],
  CHARACTER_SET_1: CHARACTER_SET_1,
  CHARACTER_SET_2: CHARACTER_SET_2,
  CHARACTER_SET_3: CHARACTER_SET_3
};

soccerCommon.register( 'KickerCharacterSets', KickerCharacterSets );