// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from center-and-variability-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import centerAndVariability from './centerAndVariability.js';
import CenterAndVariabilityStrings from './CenterAndVariabilityStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( CenterAndVariabilityStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'center_and_variability_title', 'center-and-variability.titleStringProperty' );
addToMapIfDefined( 'screen_median', 'screen.medianStringProperty' );
addToMapIfDefined( 'screen_meanAndMedian', 'screen.meanAndMedianStringProperty' );
addToMapIfDefined( 'screen_variability', 'screen.variabilityStringProperty' );
addToMapIfDefined( 'distanceInMetersAccordionBoxTitle', 'distanceInMetersAccordionBoxTitleStringProperty' );
addToMapIfDefined( 'distanceInMetersChartLabel', 'distanceInMetersChartLabelStringProperty' );
addToMapIfDefined( 'meanEqualsUnknown', 'meanEqualsUnknownStringProperty' );
addToMapIfDefined( 'medianEqualsUnknown', 'medianEqualsUnknownStringProperty' );
addToMapIfDefined( 'plotType', 'plotTypeStringProperty' );
addToMapIfDefined( 'dotPlot', 'dotPlotStringProperty' );
addToMapIfDefined( 'linePlot', 'linePlotStringProperty' );
addToMapIfDefined( 'median', 'medianStringProperty' );
addToMapIfDefined( 'mean', 'meanStringProperty' );
addToMapIfDefined( 'meanEquals', 'meanEqualsStringProperty' );
addToMapIfDefined( 'valueUnknown', 'valueUnknownStringProperty' );
addToMapIfDefined( 'meters', 'metersStringProperty' );
addToMapIfDefined( 'meter', 'meterStringProperty' );
addToMapIfDefined( 'needAtLeastFiveKicks', 'needAtLeastFiveKicksStringProperty' );
addToMapIfDefined( 'maxKicks', 'maxKicksStringProperty' );
addToMapIfDefined( 'maxKicksDescription', 'maxKicksDescriptionStringProperty' );
addToMapIfDefined( 'outliers', 'outliersStringProperty' );
addToMapIfDefined( 'outliersDescription', 'outliersDescriptionStringProperty' );
addToMapIfDefined( 'pointer', 'pointerStringProperty' );
addToMapIfDefined( 'medianQuestion', 'medianQuestionStringProperty' );
addToMapIfDefined( 'sortData', 'sortDataStringProperty' );
addToMapIfDefined( 'youSortedTheData', 'youSortedTheDataStringProperty' );
addToMapIfDefined( 'medianDescription', 'medianDescriptionStringProperty' );
addToMapIfDefined( 'meanAndMedianQuestion', 'meanAndMedianQuestionStringProperty' );
addToMapIfDefined( 'meanDescription', 'meanDescriptionStringProperty' );
addToMapIfDefined( 'variabilityQuestion', 'variabilityQuestionStringProperty' );
addToMapIfDefined( 'iqrEqualsUnknown', 'iqrEqualsUnknownStringProperty' );
addToMapIfDefined( 'rangeEqualsUnknown', 'rangeEqualsUnknownStringProperty' );
addToMapIfDefined( 'madEqualsUnknown', 'madEqualsUnknownStringProperty' );
addToMapIfDefined( 'madEquals', 'madEqualsStringProperty' );
addToMapIfDefined( 'range', 'rangeStringProperty' );
addToMapIfDefined( 'interquartileRangeIQR', 'interquartileRangeIQRStringProperty' );
addToMapIfDefined( 'iqr', 'iqrStringProperty' );
addToMapIfDefined( 'min', 'minStringProperty' );
addToMapIfDefined( 'max', 'maxStringProperty' );
addToMapIfDefined( 'q1', 'q1StringProperty' );
addToMapIfDefined( 'q3', 'q3StringProperty' );
addToMapIfDefined( 'meanAbsoluteDeviationMAD', 'meanAbsoluteDeviationMADStringProperty' );
addToMapIfDefined( 'mad', 'madStringProperty' );
addToMapIfDefined( 'intervalTool', 'intervalToolStringProperty' );
addToMapIfDefined( 'predictMean', 'predictMeanStringProperty' );
addToMapIfDefined( 'predictMedian', 'predictMedianStringProperty' );
addToMapIfDefined( 'rangeDescription', 'rangeDescriptionStringProperty' );
addToMapIfDefined( 'iqrDescription', 'iqrDescriptionStringProperty' );
addToMapIfDefined( 'dataValuesInMeters', 'dataValuesInMetersStringProperty' );
addToMapIfDefined( 'madDescription', 'madDescriptionStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_move', 'keyboardHelpDialog.moveStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_endOfNumberLine', 'keyboardHelpDialog.endOfNumberLineStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_startOfNumberLine', 'keyboardHelpDialog.startOfNumberLineStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_grabOrReleaseBall', 'keyboardHelpDialog.grabOrReleaseBallStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveGrabbedBallTitle', 'keyboardHelpDialog.moveGrabbedBallTitleStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveGrabbedBall', 'keyboardHelpDialog.moveGrabbedBallStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_grabOrRelease', 'keyboardHelpDialog.grabOrReleaseStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpToStartOfNumberLine', 'keyboardHelpDialog.jumpToStartOfNumberLineStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpToEndOfNumberLine', 'keyboardHelpDialog.jumpToEndOfNumberLineStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpBallToTickMark', 'keyboardHelpDialog.jumpBallToTickMarkStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveInLargerSteps', 'keyboardHelpDialog.moveInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_grabOrReleaseBallOrCard', 'keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_movePredictMedian', 'keyboardHelpDialog.medianScreen.movePredictMedianStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_predictMedian', 'keyboardHelpDialog.medianScreen.predictMedianStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCardTitle', 'keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCard', 'keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_jumpToStartOfCardsOrNumberLine', 'keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_jumpToEndOfCardsOrNumberLine', 'keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanOrMedian', 'keyboardHelpDialog.meanAndMedianScreen.movePredictMeanOrMedianStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_movePredictionPointer', 'keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanInSmallerSteps', 'keyboardHelpDialog.meanAndMedianScreen.movePredictMeanInSmallerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_moveInLargerSteps', 'keyboardHelpDialog.meanAndMedianScreen.moveInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_variabilityScreen_movePointerIntervalHandleOrIntervalBlock', 'keyboardHelpDialog.variabilityScreen.movePointerIntervalHandleOrIntervalBlockStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_variabilityScreen_object', 'keyboardHelpDialog.variabilityScreen.objectStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_playArea_guidingQuestion', 'a11y.screenSummary.playArea.guidingQuestionStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_currentDetails_countAtMeter', 'a11y.screenSummary.currentDetails.countAtMeterStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_interactionHint_noBalls', 'a11y.screenSummary.interactionHint.noBallsStringProperty' );
addToMapIfDefined( 'a11y_soccerField_accessibleHeading', 'a11y.soccerField.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_eraseButton_accessibleName', 'a11y.eraseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_eraseButton_accessibleHelpText', 'a11y.eraseButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_eraseButton_contextResponse', 'a11y.eraseButton.contextResponseStringProperty' );
addToMapIfDefined( 'a11y_medianPredictionSlider_accessibleName', 'a11y.medianPredictionSlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanPredictionSlider_accessibleName', 'a11y.meanPredictionSlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianCheckbox_accessibleName', 'a11y.medianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianCheckbox_accessibleHelpText', 'a11y.medianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanCheckbox_accessibleName', 'a11y.meanCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanCheckbox_accessibleHelpText', 'a11y.meanCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_predictMedianCheckbox_accessibleName', 'a11y.predictMedianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_predictMedianCheckbox_accessibleHelpText', 'a11y.predictMedianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_predictMeanCheckbox_accessibleName', 'a11y.predictMeanCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_predictMeanCheckbox_accessibleHelpText', 'a11y.predictMeanCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_infoDialog_dataValues', 'a11y.infoDialog.dataValuesStringProperty' );
addToMapIfDefined( 'a11y_noKicksLeftResponse', 'a11y.noKicksLeftResponseStringProperty' );
addToMapIfDefined( 'a11y_meanReadout_accessibleParagraph', 'a11y.meanReadout.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_medianReadout_accessibleParagraph', 'a11y.medianReadout.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_screenButtonsHelpText', 'a11y.medianScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_screenSummary_playArea', 'a11y.medianScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_screenSummary_controlArea', 'a11y.medianScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_screenSummary_currentDetails_soccerBalls', 'a11y.medianScreen.screenSummary.currentDetails.soccerBallsStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_screenSummary_currentDetails_cards', 'a11y.medianScreen.screenSummary.currentDetails.cardsStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_screenSummary_interactionHint_someBalls', 'a11y.medianScreen.screenSummary.interactionHint.someBallsStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_dataCardsGroup_noCardsAccessibleName', 'a11y.medianScreen.dataCardsGroup.noCardsAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_dataCardsGroup_selectAccessibleName', 'a11y.medianScreen.dataCardsGroup.selectAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_dataCardsGroup_sortAccessibleName', 'a11y.medianScreen.dataCardsGroup.sortAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_dataCardsGroup_selectAccessibleHelpText', 'a11y.medianScreen.dataCardsGroup.selectAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_dataCardsGroup_sortAccessibleHelpText', 'a11y.medianScreen.dataCardsGroup.sortAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_sortDataCheckbox_accessibleName', 'a11y.medianScreen.sortDataCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_sortDataCheckbox_accessibleHelpText', 'a11y.medianScreen.sortDataCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_medianCheckbox_accessibleName', 'a11y.medianScreen.medianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_medianCheckbox_accessibleHelpText', 'a11y.medianScreen.medianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_medianScreen_infoButton_accessibleName', 'a11y.medianScreen.infoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_screenButtonsHelpText', 'a11y.meanAndMedianScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_screenSummary_playArea', 'a11y.meanAndMedianScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_screenSummary_currentDetails_soccerBalls', 'a11y.meanAndMedianScreen.screenSummary.currentDetails.soccerBallsStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_screenSummary_currentDetails_plot', 'a11y.meanAndMedianScreen.screenSummary.currentDetails.plotStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_screenSummary_controlArea', 'a11y.meanAndMedianScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_screenSummary_interactionHint_someBalls', 'a11y.meanAndMedianScreen.screenSummary.interactionHint.someBallsStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_meanAndMedianAccordionBox_accessibleHelpText', 'a11y.meanAndMedianScreen.meanAndMedianAccordionBox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_plotMedianCheckbox_accessibleName', 'a11y.meanAndMedianScreen.plotMedianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_plotMedianCheckbox_accessibleHelpText', 'a11y.meanAndMedianScreen.plotMedianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_meanCheckbox_accessibleName', 'a11y.meanAndMedianScreen.meanCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_meanCheckbox_accessibleHelpText', 'a11y.meanAndMedianScreen.meanCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_infoButton_accessibleName', 'a11y.meanAndMedianScreen.infoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreen_infoDialog_meanEquationDescription', 'a11y.meanAndMedianScreen.infoDialog.meanEquationDescriptionStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_screenButtonsHelpText', 'a11y.variabilityScreen.screenButtonsHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_screenSummary_playArea', 'a11y.variabilityScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_screenSummary_currentDetails_soccerBalls', 'a11y.variabilityScreen.screenSummary.currentDetails.soccerBallsStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_screenSummary_currentDetails_plot', 'a11y.variabilityScreen.screenSummary.currentDetails.plotStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_screenSummary_controlArea', 'a11y.variabilityScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_screenSummary_interactionHint_someBalls', 'a11y.variabilityScreen.screenSummary.interactionHint.someBallsStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_accessibleName', 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_accessibleHelpText', 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker1RadioButton_accessibleName', 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker1RadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker2RadioButton_accessibleName', 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker2RadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker3RadioButton_accessibleName', 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker3RadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker4RadioButton_accessibleName', 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker4RadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_pointerCheckbox_accessibleHelpText', 'a11y.variabilityScreen.pointerCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_pointerNode_accessibleName', 'a11y.variabilityScreen.pointerNode.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measuresRadioButtonGroup_accessibleName', 'a11y.variabilityScreen.measuresRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measuresRadioButtonGroup_accessibleHelpText', 'a11y.variabilityScreen.measuresRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measureAccordionBox_rangeAccessibleHelpText', 'a11y.variabilityScreen.measureAccordionBox.rangeAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measureAccordionBox_rangeAccessibleParagraph', 'a11y.variabilityScreen.measureAccordionBox.rangeAccessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measureAccordionBox_iqrAccessibleHelpText', 'a11y.variabilityScreen.measureAccordionBox.iqrAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measureAccordionBox_iqrAccessibleParagraph', 'a11y.variabilityScreen.measureAccordionBox.iqrAccessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measureAccordionBox_madAccessibleHelpText', 'a11y.variabilityScreen.measureAccordionBox.madAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_measureAccordionBox_madAccessibleParagraph', 'a11y.variabilityScreen.measureAccordionBox.madAccessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_rangeCheckbox_accessibleHelpText', 'a11y.variabilityScreen.rangeCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_iqrCheckbox_accessibleHelpText', 'a11y.variabilityScreen.iqrCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_madCheckbox_accessibleHelpText', 'a11y.variabilityScreen.madCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_infoButton_accessibleName', 'a11y.variabilityScreen.infoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_infoDialog_rangeMinusPattern', 'a11y.variabilityScreen.infoDialog.rangeMinusPatternStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_infoDialog_iqrMinusPattern', 'a11y.variabilityScreen.infoDialog.iqrMinusPatternStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_infoDialog_boxPlot_accessibleParagraph', 'a11y.variabilityScreen.infoDialog.boxPlot.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_infoDialog_madEquationDescription', 'a11y.variabilityScreen.infoDialog.madEquationDescriptionStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_infoDialog_madPlot_accessibleParagraph', 'a11y.variabilityScreen.infoDialog.madPlot.accessibleParagraphStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_intervalTool_accessibleHeading', 'a11y.variabilityScreen.intervalTool.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_intervalTool_accessibleHelpText', 'a11y.variabilityScreen.intervalTool.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_intervalTool_handle1_accessibleName', 'a11y.variabilityScreen.intervalTool.handle1.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_intervalTool_handle2_accessibleName', 'a11y.variabilityScreen.intervalTool.handle2.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_intervalTool_rectangle_accessibleName', 'a11y.variabilityScreen.intervalTool.rectangle.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreen_intervalTool_rectangleObjectResponsePattern', 'a11y.variabilityScreen.intervalTool.rectangleObjectResponsePatternStringProperty' );
addToMapIfDefined( 'a11y_preferences_plotTypeRadioButtonGroup_accessibleHelpText', 'a11y.preferences.plotTypeRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_moveGrabbedBallOrCardDescription', 'a11y.keyboardHelp.moveGrabbedBallOrCardDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_moveGrabbedBallDescription', 'a11y.keyboardHelp.moveGrabbedBallDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_moveInLargerStepsDescription', 'a11y.keyboardHelp.moveInLargerStepsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_jumpToStartOfNumberLineDescription', 'a11y.keyboardHelp.jumpToStartOfNumberLineDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_jumpToEndOfNumberLineDescription', 'a11y.keyboardHelp.jumpToEndOfNumberLineDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_jumpToStartOfCardsOrNumberLineDescription', 'a11y.keyboardHelp.jumpToStartOfCardsOrNumberLineDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_jumpToEndOfCardsOrNumberLineDescription', 'a11y.keyboardHelp.jumpToEndOfCardsOrNumberLineDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelp_jumpBallToTickMarkDescription', 'a11y.keyboardHelp.jumpBallToTickMarkDescriptionStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value.replace('\n','\n ')}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const CenterAndVariabilityFluent = {
  "center-and-variability": {
    _comment_0: new FluentComment( {"comment":"sim name","associatedKey":"center-and-variability.title"} ),
    titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'center_and_variability_title', _.get( CenterAndVariabilityStrings, 'center-and-variability.titleStringProperty' ) )
  },
  screen: {
    _comment_0: new FluentComment( {"comment":"screen names","associatedKey":"screen.median"} ),
    medianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_median', _.get( CenterAndVariabilityStrings, 'screen.medianStringProperty' ) ),
    meanAndMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_meanAndMedian', _.get( CenterAndVariabilityStrings, 'screen.meanAndMedianStringProperty' ) ),
    variabilityStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_variability', _.get( CenterAndVariabilityStrings, 'screen.variabilityStringProperty' ) )
  },
  _comment_0: new FluentComment( {"comment":"common strings","associatedKey":"kickValuePattern"} ),
  kickValuePatternStringProperty: _.get( CenterAndVariabilityStrings, 'kickValuePatternStringProperty' ),
  distanceInMetersAccordionBoxTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersAccordionBoxTitle', _.get( CenterAndVariabilityStrings, 'distanceInMetersAccordionBoxTitleStringProperty' ) ),
  distanceInMetersChartLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersChartLabel', _.get( CenterAndVariabilityStrings, 'distanceInMetersChartLabelStringProperty' ) ),
  meanEqualsValueMetersPatternStringProperty: _.get( CenterAndVariabilityStrings, 'meanEqualsValueMetersPatternStringProperty' ),
  meanEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'meanEqualsValueMPatternStringProperty' ),
  meanEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanEqualsUnknown', _.get( CenterAndVariabilityStrings, 'meanEqualsUnknownStringProperty' ) ),
  medianEqualsValuePatternStringProperty: _.get( CenterAndVariabilityStrings, 'medianEqualsValuePatternStringProperty' ),
  medianEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'medianEqualsValueMPatternStringProperty' ),
  medianEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianEqualsUnknown', _.get( CenterAndVariabilityStrings, 'medianEqualsUnknownStringProperty' ) ),
  medianEqualsValueUnitsPatternStringProperty: _.get( CenterAndVariabilityStrings, 'medianEqualsValueUnitsPatternStringProperty' ),
  plotTypeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'plotType', _.get( CenterAndVariabilityStrings, 'plotTypeStringProperty' ) ),
  dotPlotStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'dotPlot', _.get( CenterAndVariabilityStrings, 'dotPlotStringProperty' ) ),
  linePlotStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'linePlot', _.get( CenterAndVariabilityStrings, 'linePlotStringProperty' ) ),
  medianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'median', _.get( CenterAndVariabilityStrings, 'medianStringProperty' ) ),
  meanStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'mean', _.get( CenterAndVariabilityStrings, 'meanStringProperty' ) ),
  meanEqualsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanEquals', _.get( CenterAndVariabilityStrings, 'meanEqualsStringProperty' ) ),
  valueUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'valueUnknown', _.get( CenterAndVariabilityStrings, 'valueUnknownStringProperty' ) ),
  metersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meters', _.get( CenterAndVariabilityStrings, 'metersStringProperty' ) ),
  meterStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meter', _.get( CenterAndVariabilityStrings, 'meterStringProperty' ) ),
  needAtLeastFiveKicksStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'needAtLeastFiveKicks', _.get( CenterAndVariabilityStrings, 'needAtLeastFiveKicksStringProperty' ) ),
  maxKicksStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'maxKicks', _.get( CenterAndVariabilityStrings, 'maxKicksStringProperty' ) ),
  maxKicksDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'maxKicksDescription', _.get( CenterAndVariabilityStrings, 'maxKicksDescriptionStringProperty' ) ),
  outliersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'outliers', _.get( CenterAndVariabilityStrings, 'outliersStringProperty' ) ),
  outliersDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'outliersDescription', _.get( CenterAndVariabilityStrings, 'outliersDescriptionStringProperty' ) ),
  valueKicksPatternStringProperty: _.get( CenterAndVariabilityStrings, 'valueKicksPatternStringProperty' ),
  pointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'pointer', _.get( CenterAndVariabilityStrings, 'pointerStringProperty' ) ),
  _comment_1: new FluentComment( {"comment":"median strings","associatedKey":"medianQuestion"} ),
  medianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianQuestion', _.get( CenterAndVariabilityStrings, 'medianQuestionStringProperty' ) ),
  sortDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'sortData', _.get( CenterAndVariabilityStrings, 'sortDataStringProperty' ) ),
  youSortedTheDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'youSortedTheData', _.get( CenterAndVariabilityStrings, 'youSortedTheDataStringProperty' ) ),
  medianDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianDescription', _.get( CenterAndVariabilityStrings, 'medianDescriptionStringProperty' ) ),
  _comment_2: new FluentComment( {"comment":"mean and median strings","associatedKey":"meanAndMedianQuestion"} ),
  meanAndMedianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanAndMedianQuestion', _.get( CenterAndVariabilityStrings, 'meanAndMedianQuestionStringProperty' ) ),
  meanDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanDescription', _.get( CenterAndVariabilityStrings, 'meanDescriptionStringProperty' ) ),
  _comment_3: new FluentComment( {"comment":"variability strings","associatedKey":"variabilityQuestion"} ),
  variabilityQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'variabilityQuestion', _.get( CenterAndVariabilityStrings, 'variabilityQuestionStringProperty' ) ),
  iqrEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'iqrEqualsValueMPatternStringProperty' ),
  iqrEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqrEqualsUnknown', _.get( CenterAndVariabilityStrings, 'iqrEqualsUnknownStringProperty' ) ),
  rangeEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'rangeEqualsValueMPatternStringProperty' ),
  rangeEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rangeEqualsUnknown', _.get( CenterAndVariabilityStrings, 'rangeEqualsUnknownStringProperty' ) ),
  madEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'madEqualsValueMPatternStringProperty' ),
  madEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madEqualsUnknown', _.get( CenterAndVariabilityStrings, 'madEqualsUnknownStringProperty' ) ),
  madEqualsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madEquals', _.get( CenterAndVariabilityStrings, 'madEqualsStringProperty' ) ),
  rangeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'range', _.get( CenterAndVariabilityStrings, 'rangeStringProperty' ) ),
  interquartileRangeIQRStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'interquartileRangeIQR', _.get( CenterAndVariabilityStrings, 'interquartileRangeIQRStringProperty' ) ),
  iqrStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqr', _.get( CenterAndVariabilityStrings, 'iqrStringProperty' ) ),
  minStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'min', _.get( CenterAndVariabilityStrings, 'minStringProperty' ) ),
  maxStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'max', _.get( CenterAndVariabilityStrings, 'maxStringProperty' ) ),
  q1StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'q1', _.get( CenterAndVariabilityStrings, 'q1StringProperty' ) ),
  q3StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'q3', _.get( CenterAndVariabilityStrings, 'q3StringProperty' ) ),
  meanAbsoluteDeviationMADStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanAbsoluteDeviationMAD', _.get( CenterAndVariabilityStrings, 'meanAbsoluteDeviationMADStringProperty' ) ),
  madStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'mad', _.get( CenterAndVariabilityStrings, 'madStringProperty' ) ),
  intervalToolStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'intervalTool', _.get( CenterAndVariabilityStrings, 'intervalToolStringProperty' ) ),
  predictMeanStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'predictMean', _.get( CenterAndVariabilityStrings, 'predictMeanStringProperty' ) ),
  predictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'predictMedian', _.get( CenterAndVariabilityStrings, 'predictMedianStringProperty' ) ),
  rangeDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rangeDescription', _.get( CenterAndVariabilityStrings, 'rangeDescriptionStringProperty' ) ),
  iqrDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqrDescription', _.get( CenterAndVariabilityStrings, 'iqrDescriptionStringProperty' ) ),
  dataValuesInMetersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'dataValuesInMeters', _.get( CenterAndVariabilityStrings, 'dataValuesInMetersStringProperty' ) ),
  iqrEqualsQ3MinusQ3PatternStringProperty: _.get( CenterAndVariabilityStrings, 'iqrEqualsQ3MinusQ3PatternStringProperty' ),
  iqrEqualsIQRUnitsPatternStringProperty: _.get( CenterAndVariabilityStrings, 'iqrEqualsIQRUnitsPatternStringProperty' ),
  madDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madDescription', _.get( CenterAndVariabilityStrings, 'madDescriptionStringProperty' ) ),
  madEqualsMADMetersPatternStringProperty: _.get( CenterAndVariabilityStrings, 'madEqualsMADMetersPatternStringProperty' ),
  rangeEqualsMaxMinusMinPatternStringProperty: _.get( CenterAndVariabilityStrings, 'rangeEqualsMaxMinusMinPatternStringProperty' ),
  rangeEqualsRangeUnitsPatternStringProperty: _.get( CenterAndVariabilityStrings, 'rangeEqualsRangeUnitsPatternStringProperty' ),
  keyboardHelpDialog: {
    _comment_0: new FluentComment( {"comment":"keyboard help dialog strings","associatedKey":"keyboardHelpDialog.move"} ),
    moveStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_move', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.moveStringProperty' ) ),
    endOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_endOfNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.endOfNumberLineStringProperty' ) ),
    startOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_startOfNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.startOfNumberLineStringProperty' ) ),
    grabOrReleaseBallStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_grabOrReleaseBall', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.grabOrReleaseBallStringProperty' ) ),
    moveGrabbedBallTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveGrabbedBallTitle', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.moveGrabbedBallTitleStringProperty' ) ),
    moveGrabbedBallStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveGrabbedBall', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.moveGrabbedBallStringProperty' ) ),
    grabOrReleaseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_grabOrRelease', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.grabOrReleaseStringProperty' ) ),
    jumpToStartOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpToStartOfNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.jumpToStartOfNumberLineStringProperty' ) ),
    jumpToEndOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpToEndOfNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.jumpToEndOfNumberLineStringProperty' ) ),
    jumpBallToTickMarkStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpBallToTickMark', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.jumpBallToTickMarkStringProperty' ) ),
    moveInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveInLargerSteps', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.moveInLargerStepsStringProperty' ) ),
    _comment_1: new FluentComment( {"comment":"Content for the Median screen.","associatedKey":"medianScreen"} ),
    medianScreen: {
      grabOrReleaseBallOrCardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_grabOrReleaseBallOrCard', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty' ) ),
      movePredictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_movePredictMedian', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.movePredictMedianStringProperty' ) ),
      predictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_predictMedian', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.predictMedianStringProperty' ) ),
      moveGrabbedBallOrCardTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCardTitle', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty' ) ),
      moveGrabbedBallOrCardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCard', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty' ) ),
      jumpToStartOfCardsOrNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_jumpToStartOfCardsOrNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty' ) ),
      jumpToEndOfCardsOrNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_jumpToEndOfCardsOrNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty' ) )
    },
    _comment_2: new FluentComment( {"comment":"Content for the Mean and Median screen.","associatedKey":"meanAndMedianScreen"} ),
    meanAndMedianScreen: {
      movePredictMeanOrMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanOrMedian', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.movePredictMeanOrMedianStringProperty' ) ),
      movePredictionPointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictionPointer', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty' ) ),
      movePredictMeanInSmallerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanInSmallerSteps', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.movePredictMeanInSmallerStepsStringProperty' ) ),
      moveInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_moveInLargerSteps', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.moveInLargerStepsStringProperty' ) )
    },
    _comment_3: new FluentComment( {"comment":"Content for the Variability screen.","associatedKey":"variabilityScreen"} ),
    variabilityScreen: {
      movePointerIntervalHandleOrIntervalBlockStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_variabilityScreen_movePointerIntervalHandleOrIntervalBlock', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.variabilityScreen.movePointerIntervalHandleOrIntervalBlockStringProperty' ) ),
      objectStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_variabilityScreen_object', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.variabilityScreen.objectStringProperty' ) )
    }
  },
  _comment_4: new FluentComment( {"comment":"accessibility strings","associatedKey":"a11y"} ),
  a11y: {
    _comment_0: new FluentComment( {"comment":"Screen summary content that appears in each screen.","associatedKey":"screenSummary"} ),
    screenSummary: {
      playArea: {
        guidingQuestion: new FluentPattern<{ question: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_screenSummary_playArea_guidingQuestion', _.get( CenterAndVariabilityStrings, 'a11y.screenSummary.playArea.guidingQuestionStringProperty' ), [{"name":"question"}] )
      },
      currentDetails: {
        countAtMeter: new FluentPattern<{ distance: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_screenSummary_currentDetails_countAtMeter', _.get( CenterAndVariabilityStrings, 'a11y.screenSummary.currentDetails.countAtMeterStringProperty' ), [{"name":"distance"},{"name":"number"}] )
      },
      interactionHint: {
        noBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screenSummary_interactionHint_noBalls', _.get( CenterAndVariabilityStrings, 'a11y.screenSummary.interactionHint.noBallsStringProperty' ) )
      }
    },
    _comment_1: new FluentComment( {"comment":"Strings for components that are used in all screens.","associatedKey":"soccerField"} ),
    soccerField: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soccerField_accessibleHeading', _.get( CenterAndVariabilityStrings, 'a11y.soccerField.accessibleHeadingStringProperty' ) )
    },
    eraseButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraseButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.eraseButton.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraseButton_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.eraseButton.accessibleHelpTextStringProperty' ) ),
      contextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraseButton_contextResponse', _.get( CenterAndVariabilityStrings, 'a11y.eraseButton.contextResponseStringProperty' ) )
    },
    medianPredictionSlider: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianPredictionSlider_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianPredictionSlider.accessibleNameStringProperty' ) )
    },
    meanPredictionSlider: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanPredictionSlider_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanPredictionSlider.accessibleNameStringProperty' ) )
    },
    medianCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianCheckbox.accessibleHelpTextStringProperty' ) )
    },
    meanCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanCheckbox.accessibleHelpTextStringProperty' ) )
    },
    predictMedianCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_predictMedianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.predictMedianCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_predictMedianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.predictMedianCheckbox.accessibleHelpTextStringProperty' ) )
    },
    predictMeanCheckbox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_predictMeanCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.predictMeanCheckbox.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_predictMeanCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.predictMeanCheckbox.accessibleHelpTextStringProperty' ) )
    },
    infoDialog: {
      dataValues: new FluentPattern<{ values: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_infoDialog_dataValues', _.get( CenterAndVariabilityStrings, 'a11y.infoDialog.dataValuesStringProperty' ), [{"name":"values"}] )
    },
    noKicksLeftResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_noKicksLeftResponse', _.get( CenterAndVariabilityStrings, 'a11y.noKicksLeftResponseStringProperty' ) ),
    meanReadout: {
      accessibleParagraph: new FluentPattern<{ value: 'null' | 1 | number | 'other' | TReadOnlyProperty<'null' | 1 | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_meanReadout_accessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.meanReadout.accessibleParagraphStringProperty' ), [{"name":"value","variants":["null",1,{"type":"number","value":"other"}]}] )
    },
    medianReadout: {
      accessibleParagraph: new FluentPattern<{ value: 'null' | 1 | number | 'other' | TReadOnlyProperty<'null' | 1 | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_medianReadout_accessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.medianReadout.accessibleParagraphStringProperty' ), [{"name":"value","variants":["null",1,{"type":"number","value":"other"}]}] )
    },
    _comment_2: new FluentComment( {"comment":"Content for the Median screen.","associatedKey":"medianScreen"} ),
    medianScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_screenButtonsHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.screenButtonsHelpTextStringProperty' ) ),
      _comment_0: new FluentComment( {"comment":"Screen summary content that appears in each screen.","associatedKey":"screenSummary"} ),
      screenSummary: {
        playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_medianScreen_screenSummary_playArea', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.screenSummary.playAreaStringProperty' ), [{"name":"maxBalls"}] ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_screenSummary_controlArea', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: {
          soccerBalls: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_medianScreen_screenSummary_currentDetails_soccerBalls', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.screenSummary.currentDetails.soccerBallsStringProperty' ), [{"name":"number"}] ),
          cards: new FluentPattern<{ distances: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_medianScreen_screenSummary_currentDetails_cards', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.screenSummary.currentDetails.cardsStringProperty' ), [{"name":"distances"},{"name":"number"}] )
        },
        interactionHint: {
          someBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_screenSummary_interactionHint_someBalls', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.screenSummary.interactionHint.someBallsStringProperty' ) )
        }
      },
      dataCardsGroup: {
        noCardsAccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_dataCardsGroup_noCardsAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.dataCardsGroup.noCardsAccessibleNameStringProperty' ) ),
        selectAccessibleName: new FluentPattern<{ index: FluentVariable, total: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_medianScreen_dataCardsGroup_selectAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.dataCardsGroup.selectAccessibleNameStringProperty' ), [{"name":"index"},{"name":"total"},{"name":"value"}] ),
        sortAccessibleName: new FluentPattern<{ index: FluentVariable, total: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_medianScreen_dataCardsGroup_sortAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.dataCardsGroup.sortAccessibleNameStringProperty' ), [{"name":"index"},{"name":"total"},{"name":"value"}] ),
        selectAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_dataCardsGroup_selectAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.dataCardsGroup.selectAccessibleHelpTextStringProperty' ) ),
        sortAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_dataCardsGroup_sortAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.dataCardsGroup.sortAccessibleHelpTextStringProperty' ) )
      },
      sortDataCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_sortDataCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.sortDataCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_sortDataCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.sortDataCheckbox.accessibleHelpTextStringProperty' ) )
      },
      medianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_medianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.medianCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_medianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.medianCheckbox.accessibleHelpTextStringProperty' ) )
      },
      infoButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreen_infoButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.medianScreen.infoButton.accessibleNameStringProperty' ) )
      }
    },
    _comment_3: new FluentComment( {"comment":"Content for the Mean and Median screen.","associatedKey":"meanAndMedianScreen"} ),
    meanAndMedianScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_screenButtonsHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.screenButtonsHelpTextStringProperty' ) ),
      _comment_0: new FluentComment( {"comment":"Screen summary content that appears in each screen.","associatedKey":"screenSummary"} ),
      screenSummary: {
        playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_screenSummary_playArea', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.screenSummary.playAreaStringProperty' ), [{"name":"maxBalls"}] ),
        currentDetails: {
          soccerBalls: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_screenSummary_currentDetails_soccerBalls', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.screenSummary.currentDetails.soccerBallsStringProperty' ), [{"name":"number"}] ),
          plot: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_screenSummary_currentDetails_plot', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.screenSummary.currentDetails.plotStringProperty' ), [{"name":"number"}] )
        },
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_screenSummary_controlArea', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.screenSummary.controlAreaStringProperty' ) ),
        interactionHint: {
          someBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_screenSummary_interactionHint_someBalls', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.screenSummary.interactionHint.someBallsStringProperty' ) )
        }
      },
      meanAndMedianAccordionBox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_meanAndMedianAccordionBox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.meanAndMedianAccordionBox.accessibleHelpTextStringProperty' ) )
      },
      plotMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_plotMedianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.plotMedianCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_plotMedianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.plotMedianCheckbox.accessibleHelpTextStringProperty' ) )
      },
      meanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_meanCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.meanCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_meanCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.meanCheckbox.accessibleHelpTextStringProperty' ) )
      },
      infoButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_infoButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.infoButton.accessibleNameStringProperty' ) )
      },
      infoDialog: {
        meanEquationDescription: new FluentPattern<{ sum: FluentVariable, total: FluentVariable, values: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreen_infoDialog_meanEquationDescription', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreen.infoDialog.meanEquationDescriptionStringProperty' ), [{"name":"sum"},{"name":"total"},{"name":"values"}] )
      }
    },
    _comment_4: new FluentComment( {"comment":"Content for the Variability screen.","associatedKey":"variabilityScreen"} ),
    variabilityScreen: {
      screenButtonsHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_screenButtonsHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.screenButtonsHelpTextStringProperty' ) ),
      _comment_0: new FluentComment( {"comment":"Screen summary content that appears in each screen.","associatedKey":"screenSummary"} ),
      screenSummary: {
        playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_screenSummary_playArea', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.screenSummary.playAreaStringProperty' ), [{"name":"maxBalls"}] ),
        currentDetails: {
          soccerBalls: new FluentPattern<{ kicker: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_screenSummary_currentDetails_soccerBalls', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.screenSummary.currentDetails.soccerBallsStringProperty' ), [{"name":"kicker"},{"name":"number"}] ),
          plot: new FluentPattern<{ measure: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_screenSummary_currentDetails_plot', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.screenSummary.currentDetails.plotStringProperty' ), [{"name":"measure"},{"name":"number"}] )
        },
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_screenSummary_controlArea', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.screenSummary.controlAreaStringProperty' ) ),
        interactionHint: {
          someBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_screenSummary_interactionHint_someBalls', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.screenSummary.interactionHint.someBallsStringProperty' ) )
        }
      },
      sceneKickerRadioButtonGroup: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.accessibleHelpTextStringProperty' ) ),
        kicker1RadioButton: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker1RadioButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker1RadioButton.accessibleNameStringProperty' ) )
        },
        kicker2RadioButton: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker2RadioButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker2RadioButton.accessibleNameStringProperty' ) )
        },
        kicker3RadioButton: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker3RadioButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker3RadioButton.accessibleNameStringProperty' ) )
        },
        kicker4RadioButton: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_sceneKickerRadioButtonGroup_kicker4RadioButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.sceneKickerRadioButtonGroup.kicker4RadioButton.accessibleNameStringProperty' ) )
        }
      },
      pointerCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_pointerCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.pointerCheckbox.accessibleHelpTextStringProperty' ) )
      },
      pointerNode: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_pointerNode_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.pointerNode.accessibleNameStringProperty' ) )
      },
      measuresRadioButtonGroup: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measuresRadioButtonGroup_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measuresRadioButtonGroup.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measuresRadioButtonGroup_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measuresRadioButtonGroup.accessibleHelpTextStringProperty' ) )
      },
      measureAccordionBox: {
        rangeAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measureAccordionBox_rangeAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measureAccordionBox.rangeAccessibleHelpTextStringProperty' ) ),
        rangeAccessibleParagraph: new FluentPattern<{ value: 'null' | 1 | number | 'other' | TReadOnlyProperty<'null' | 1 | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measureAccordionBox_rangeAccessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measureAccordionBox.rangeAccessibleParagraphStringProperty' ), [{"name":"value","variants":["null",1,{"type":"number","value":"other"}]}] ),
        iqrAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measureAccordionBox_iqrAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measureAccordionBox.iqrAccessibleHelpTextStringProperty' ) ),
        iqrAccessibleParagraph: new FluentPattern<{ value: 'null' | 1 | number | 'other' | TReadOnlyProperty<'null' | 1 | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measureAccordionBox_iqrAccessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measureAccordionBox.iqrAccessibleParagraphStringProperty' ), [{"name":"value","variants":["null",1,{"type":"number","value":"other"}]}] ),
        madAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measureAccordionBox_madAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measureAccordionBox.madAccessibleHelpTextStringProperty' ) ),
        madAccessibleParagraph: new FluentPattern<{ value: 'null' | 1 | number | 'other' | TReadOnlyProperty<'null' | 1 | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_measureAccordionBox_madAccessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.measureAccordionBox.madAccessibleParagraphStringProperty' ), [{"name":"value","variants":["null",1,{"type":"number","value":"other"}]}] )
      },
      rangeCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_rangeCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.rangeCheckbox.accessibleHelpTextStringProperty' ) )
      },
      iqrCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_iqrCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.iqrCheckbox.accessibleHelpTextStringProperty' ) )
      },
      madCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_madCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.madCheckbox.accessibleHelpTextStringProperty' ) )
      },
      infoButton: {
        accessibleName: new FluentPattern<{ measure: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_infoButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.infoButton.accessibleNameStringProperty' ), [{"name":"measure"}] )
      },
      infoDialog: {
        rangeMinusPattern: new FluentPattern<{ max: FluentVariable, min: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_infoDialog_rangeMinusPattern', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.infoDialog.rangeMinusPatternStringProperty' ), [{"name":"max"},{"name":"min"}] ),
        iqrMinusPattern: new FluentPattern<{ q1: FluentVariable, q3: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_infoDialog_iqrMinusPattern', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.infoDialog.iqrMinusPatternStringProperty' ), [{"name":"q1"},{"name":"q3"}] ),
        boxPlot: {
          accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_infoDialog_boxPlot_accessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.infoDialog.boxPlot.accessibleParagraphStringProperty' ) )
        },
        madEquationDescription: new FluentPattern<{ madValues: FluentVariable, numerator: FluentVariable, total: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_infoDialog_madEquationDescription', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.infoDialog.madEquationDescriptionStringProperty' ), [{"name":"madValues"},{"name":"numerator"},{"name":"total"}] ),
        madPlot: {
          accessibleParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_infoDialog_madPlot_accessibleParagraph', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.infoDialog.madPlot.accessibleParagraphStringProperty' ) )
        }
      },
      intervalTool: {
        accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_intervalTool_accessibleHeading', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.intervalTool.accessibleHeadingStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_intervalTool_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.intervalTool.accessibleHelpTextStringProperty' ) ),
        handle1: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_intervalTool_handle1_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.intervalTool.handle1.accessibleNameStringProperty' ) )
        },
        handle2: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_intervalTool_handle2_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.intervalTool.handle2.accessibleNameStringProperty' ) )
        },
        rectangle: {
          accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreen_intervalTool_rectangle_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.intervalTool.rectangle.accessibleNameStringProperty' ) )
        },
        rectangleObjectResponsePattern: new FluentPattern<{ valueA: FluentVariable, valueB: FluentVariable, width: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variabilityScreen_intervalTool_rectangleObjectResponsePattern', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreen.intervalTool.rectangleObjectResponsePatternStringProperty' ), [{"name":"valueA"},{"name":"valueB"},{"name":"width"}] )
      }
    },
    _comment_5: new FluentComment( {"comment":"Content for the Preferences dialog.","associatedKey":"preferences"} ),
    preferences: {
      plotTypeRadioButtonGroup: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_preferences_plotTypeRadioButtonGroup_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.preferences.plotTypeRadioButtonGroup.accessibleHelpTextStringProperty' ) )
      }
    },
    _comment_6: new FluentComment( {"comment":"Content for the Keyboard Help dialog.","associatedKey":"keyboardHelp"} ),
    keyboardHelp: {
      moveGrabbedBallOrCardDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_moveGrabbedBallOrCardDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.moveGrabbedBallOrCardDescriptionStringProperty' ) ),
      moveGrabbedBallDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_moveGrabbedBallDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.moveGrabbedBallDescriptionStringProperty' ) ),
      moveInLargerStepsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_moveInLargerStepsDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.moveInLargerStepsDescriptionStringProperty' ) ),
      jumpToStartOfNumberLineDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_jumpToStartOfNumberLineDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.jumpToStartOfNumberLineDescriptionStringProperty' ) ),
      jumpToEndOfNumberLineDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_jumpToEndOfNumberLineDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.jumpToEndOfNumberLineDescriptionStringProperty' ) ),
      jumpToStartOfCardsOrNumberLineDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_jumpToStartOfCardsOrNumberLineDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.jumpToStartOfCardsOrNumberLineDescriptionStringProperty' ) ),
      jumpToEndOfCardsOrNumberLineDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_jumpToEndOfCardsOrNumberLineDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.jumpToEndOfCardsOrNumberLineDescriptionStringProperty' ) ),
      jumpBallToTickMarkDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelp_jumpBallToTickMarkDescription', _.get( CenterAndVariabilityStrings, 'a11y.keyboardHelp.jumpBallToTickMarkDescriptionStringProperty' ) )
    }
  }
};

export default CenterAndVariabilityFluent;

centerAndVariability.register('CenterAndVariabilityFluent', CenterAndVariabilityFluent);
