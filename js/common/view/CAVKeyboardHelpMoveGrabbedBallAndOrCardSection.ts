// Copyright 2023-2024, University of Colorado Boulder

/**
 * CAVKeyboardHelpMoveGrabbedBallAndOrCardSection provides help content within the KeyboardHelpDialog. It instructs
 * users on how to move a grabbed ball and/or card using keyboard inputs in the Center and Variability simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import NumberKeyNode from '../../../../scenery-phet/js/keyboard/NumberKeyNode.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import centerAndVariability from '../../centerAndVariability.js';
import CenterAndVariabilityStrings from '../../CenterAndVariabilityStrings.js';
import { SECTION_LABEL_OPTIONS } from './CAVKeyboardHelpNode.js';
import CenterAndVariabilityFluent from '../../CenterAndVariabilityFluent.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import KeyboardHelpSectionRow, { LabelWithIconOptions } from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class CAVKeyboardHelpMoveGrabbedBallAndOrCardSection extends KeyboardHelpSection {
  public constructor(
    titleStringProperty: LocalizedStringProperty,
    moveMessageStringProperty: LocalizedStringProperty,
    jumpStartMessageStringProperty: LocalizedStringProperty,
    jumpEndMessageStringProperty: LocalizedStringProperty,
    objectStringProperty: TReadOnlyProperty<string>,
    locationStringProperty: TReadOnlyProperty<string>
  ) {

    super( titleStringProperty, [
      KeyboardHelpSectionRow.labelWithIconList( moveMessageStringProperty, [
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
          KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.a(), LetterKeyNode.d() ], { spacing: 1.3 } ) ),
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
          KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.w(), LetterKeyNode.s() ], { spacing: 1.3 } ) ) ], {
        labelInnerContent: CenterAndVariabilityFluent.a11y.keyboardHelp.moveGrabbedObjects.createProperty( {
          object: objectStringProperty
        } )
      } ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.moveInLargerStepsStringProperty, KeyboardHelpIconFactory.pageUpPageDownRowIcon(), {
        labelInnerContent: CenterAndVariabilityFluent.a11y.keyboardHelp.moveInLargerStepsStringProperty
      } ),

      KeyboardHelpSectionRow.labelWithIcon( jumpStartMessageStringProperty, TextKeyNode.home(), combineOptions<LabelWithIconOptions>( SECTION_LABEL_OPTIONS, {
        labelInnerContent: CenterAndVariabilityFluent.a11y.keyboardHelp.jumpToStart.createProperty( {
          location: locationStringProperty
        } )
      } ) ),
      KeyboardHelpSectionRow.labelWithIcon( jumpEndMessageStringProperty, TextKeyNode.end(), combineOptions<LabelWithIconOptions>( SECTION_LABEL_OPTIONS, {
        labelInnerContent: CenterAndVariabilityFluent.a11y.keyboardHelp.jumpToEnd.createProperty( {
          location: locationStringProperty
        } )
      } ) ),
      KeyboardHelpSectionRow.labelWithIcon( CenterAndVariabilityStrings.keyboardHelpDialog.jumpBallToTickMarkStringProperty,
        KeyboardHelpIconFactory.iconToIcon( new NumberKeyNode( 0 ), new NumberKeyNode( 9 ) ), {
          labelInnerContent: CenterAndVariabilityFluent.a11y.keyboardHelp.jumpBallToTickMarkStringProperty
        }
      ) ] );
  }
}

centerAndVariability.register( 'CAVKeyboardHelpMoveGrabbedBallAndOrCardSection', CAVKeyboardHelpMoveGrabbedBallAndOrCardSection );