// Copyright 2023, University of Colorado Boulder

/**
 * Help content for the KeyboardHelpDialog describing how to change the shape by moving sides and vertices.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import { Text } from '../../../../scenery/js/imports.js';
import centerAndVariability from '../../centerAndVariability.js';

// constants - Voicing strings not translatable
const moveShapeDescriptionStringProperty = 'hello there';
const smallerStepsDescriptionStringProperty = 'hello there';
const moveACornerOrSideStringProperty = 'hello there';
const moveInSmallerStepsStringProperty = 'hello there';
const mouseStringProperty = 'hello there';
const moveCornersOrSidesStringProperty = 'hello there';

export default class CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard extends KeyboardHelpSection {
  public constructor() {

    // basic movement
    const basicMovementRow = KeyboardHelpSectionRow.labelWithIcon(
      moveACornerOrSideStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(),
      {
        labelInnerContent: moveShapeDescriptionStringProperty
      }
    );

    // fine-grained movement
    const fineMovementRow = KeyboardHelpSectionRow.labelWithIconList(
      moveInSmallerStepsStringProperty,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( new Text( mouseStringProperty, {
          font: KeyboardHelpSectionRow.LABEL_FONT,
          maxWidth: 100
        } ) )
      ], {
        labelOptions: {
          lineWrap: 175
        },
        labelInnerContent: smallerStepsDescriptionStringProperty
      }
    );

    const rows = [ basicMovementRow, fineMovementRow ];
    super( moveCornersOrSidesStringProperty, rows );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard', CAVKeyboardHelpSectionMoveGrabbedBallAndOrCard );
