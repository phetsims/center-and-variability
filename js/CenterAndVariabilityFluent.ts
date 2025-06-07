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
import centerAndVariability from './centerAndVariability.js';
import CenterAndVariabilityStrings from './CenterAndVariabilityStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, sp: TReadOnlyProperty<string> | undefined ) => {
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'center_and_variability_title', CenterAndVariabilityStrings?.["center-and-variability"]?.["titleStringProperty"] );
addToMapIfDefined( 'screen_median', CenterAndVariabilityStrings?.["screen"]?.["medianStringProperty"] );
addToMapIfDefined( 'screen_meanAndMedian', CenterAndVariabilityStrings?.["screen"]?.["meanAndMedianStringProperty"] );
addToMapIfDefined( 'screen_variability', CenterAndVariabilityStrings?.["screen"]?.["variabilityStringProperty"] );
addToMapIfDefined( 'distanceInMetersAccordionBoxTitle', CenterAndVariabilityStrings?.["distanceInMetersAccordionBoxTitleStringProperty"] );
addToMapIfDefined( 'distanceInMetersChartLabel', CenterAndVariabilityStrings?.["distanceInMetersChartLabelStringProperty"] );
addToMapIfDefined( 'meanEqualsUnknown', CenterAndVariabilityStrings?.["meanEqualsUnknownStringProperty"] );
addToMapIfDefined( 'medianEqualsUnknown', CenterAndVariabilityStrings?.["medianEqualsUnknownStringProperty"] );
addToMapIfDefined( 'plotType', CenterAndVariabilityStrings?.["plotTypeStringProperty"] );
addToMapIfDefined( 'dotPlot', CenterAndVariabilityStrings?.["dotPlotStringProperty"] );
addToMapIfDefined( 'linePlot', CenterAndVariabilityStrings?.["linePlotStringProperty"] );
addToMapIfDefined( 'median', CenterAndVariabilityStrings?.["medianStringProperty"] );
addToMapIfDefined( 'mean', CenterAndVariabilityStrings?.["meanStringProperty"] );
addToMapIfDefined( 'meanEquals', CenterAndVariabilityStrings?.["meanEqualsStringProperty"] );
addToMapIfDefined( 'valueUnknown', CenterAndVariabilityStrings?.["valueUnknownStringProperty"] );
addToMapIfDefined( 'meters', CenterAndVariabilityStrings?.["metersStringProperty"] );
addToMapIfDefined( 'meter', CenterAndVariabilityStrings?.["meterStringProperty"] );
addToMapIfDefined( 'needAtLeastFiveKicks', CenterAndVariabilityStrings?.["needAtLeastFiveKicksStringProperty"] );
addToMapIfDefined( 'maxKicks', CenterAndVariabilityStrings?.["maxKicksStringProperty"] );
addToMapIfDefined( 'maxKicksDescription', CenterAndVariabilityStrings?.["maxKicksDescriptionStringProperty"] );
addToMapIfDefined( 'outliers', CenterAndVariabilityStrings?.["outliersStringProperty"] );
addToMapIfDefined( 'outliersDescription', CenterAndVariabilityStrings?.["outliersDescriptionStringProperty"] );
addToMapIfDefined( 'pointer', CenterAndVariabilityStrings?.["pointerStringProperty"] );
addToMapIfDefined( 'medianQuestion', CenterAndVariabilityStrings?.["medianQuestionStringProperty"] );
addToMapIfDefined( 'sortData', CenterAndVariabilityStrings?.["sortDataStringProperty"] );
addToMapIfDefined( 'youSortedTheData', CenterAndVariabilityStrings?.["youSortedTheDataStringProperty"] );
addToMapIfDefined( 'medianDescription', CenterAndVariabilityStrings?.["medianDescriptionStringProperty"] );
addToMapIfDefined( 'meanAndMedianQuestion', CenterAndVariabilityStrings?.["meanAndMedianQuestionStringProperty"] );
addToMapIfDefined( 'meanDescription', CenterAndVariabilityStrings?.["meanDescriptionStringProperty"] );
addToMapIfDefined( 'variabilityQuestion', CenterAndVariabilityStrings?.["variabilityQuestionStringProperty"] );
addToMapIfDefined( 'iqrEqualsUnknown', CenterAndVariabilityStrings?.["iqrEqualsUnknownStringProperty"] );
addToMapIfDefined( 'rangeEqualsUnknown', CenterAndVariabilityStrings?.["rangeEqualsUnknownStringProperty"] );
addToMapIfDefined( 'madEqualsUnknown', CenterAndVariabilityStrings?.["madEqualsUnknownStringProperty"] );
addToMapIfDefined( 'madEquals', CenterAndVariabilityStrings?.["madEqualsStringProperty"] );
addToMapIfDefined( 'range', CenterAndVariabilityStrings?.["rangeStringProperty"] );
addToMapIfDefined( 'interquartileRangeIQR', CenterAndVariabilityStrings?.["interquartileRangeIQRStringProperty"] );
addToMapIfDefined( 'iqr', CenterAndVariabilityStrings?.["iqrStringProperty"] );
addToMapIfDefined( 'min', CenterAndVariabilityStrings?.["minStringProperty"] );
addToMapIfDefined( 'max', CenterAndVariabilityStrings?.["maxStringProperty"] );
addToMapIfDefined( 'q1', CenterAndVariabilityStrings?.["q1StringProperty"] );
addToMapIfDefined( 'q3', CenterAndVariabilityStrings?.["q3StringProperty"] );
addToMapIfDefined( 'meanAbsoluteDeviationMAD', CenterAndVariabilityStrings?.["meanAbsoluteDeviationMADStringProperty"] );
addToMapIfDefined( 'mad', CenterAndVariabilityStrings?.["madStringProperty"] );
addToMapIfDefined( 'intervalTool', CenterAndVariabilityStrings?.["intervalToolStringProperty"] );
addToMapIfDefined( 'predictMean', CenterAndVariabilityStrings?.["predictMeanStringProperty"] );
addToMapIfDefined( 'predictMedian', CenterAndVariabilityStrings?.["predictMedianStringProperty"] );
addToMapIfDefined( 'rangeDescription', CenterAndVariabilityStrings?.["rangeDescriptionStringProperty"] );
addToMapIfDefined( 'iqrDescription', CenterAndVariabilityStrings?.["iqrDescriptionStringProperty"] );
addToMapIfDefined( 'dataValuesInMeters', CenterAndVariabilityStrings?.["dataValuesInMetersStringProperty"] );
addToMapIfDefined( 'madDescription', CenterAndVariabilityStrings?.["madDescriptionStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_move', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["moveStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_endOfNumberLine', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["endOfNumberLineStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_startOfNumberLine', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["startOfNumberLineStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_grabOrReleaseBall', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["grabOrReleaseBallStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_moveGrabbedBallTitle', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["moveGrabbedBallTitleStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_moveGrabbedBall', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["moveGrabbedBallStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_grabOrRelease', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["grabOrReleaseStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_jumpToStartOfNumberLine', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["jumpToStartOfNumberLineStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_jumpToEndOfNumberLine', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["jumpToEndOfNumberLineStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_jumpBallToTickMark', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["jumpBallToTickMarkStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_moveInLargerSteps', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["moveInLargerStepsStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_grabOrReleaseBallOrCard', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["grabOrReleaseBallOrCardStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_movePredictMedian', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["movePredictMedianStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_predictMedian', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["predictMedianStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCardTitle', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["moveGrabbedBallOrCardTitleStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCard', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["moveGrabbedBallOrCardStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_jumpToStartOfCardsOrNumberLine', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["jumpToStartOfCardsOrNumberLineStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_medianScreen_jumpToEndOfCardsOrNumberLine', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["medianScreen"]?.["jumpToEndOfCardsOrNumberLineStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanOrMedian', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["meanAndMedianScreen"]?.["movePredictMeanOrMedianStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_movePredictionPointer', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["meanAndMedianScreen"]?.["movePredictionPointerStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanInSmallerSteps', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["meanAndMedianScreen"]?.["movePredictMeanInSmallerStepsStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_meanAndMedianScreen_moveInLargerSteps', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["meanAndMedianScreen"]?.["moveInLargerStepsStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_variabilityScreen_movePointerIntervalHandleOrIntervalBlock', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["variabilityScreen"]?.["movePointerIntervalHandleOrIntervalBlockStringProperty"] );
addToMapIfDefined( 'keyboardHelpDialog_variabilityScreen_object', CenterAndVariabilityStrings?.["keyboardHelpDialog"]?.["variabilityScreen"]?.["objectStringProperty"] );
addToMapIfDefined( 'a11y_medianScreenHelpText', CenterAndVariabilityStrings?.["a11y"]?.["medianScreenHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedianScreenHelpText', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedianScreenHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variabilityScreenHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variabilityScreenHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_common_currentDetails_listItemPattern', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["currentDetails"]?.["listItemPatternStringProperty"] );
addToMapIfDefined( 'a11y_common_guidingQuestion', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["guidingQuestionStringProperty"] );
addToMapIfDefined( 'a11y_common_soccerField', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["soccerFieldStringProperty"] );
addToMapIfDefined( 'a11y_common_interactionHintNoBalls', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["interactionHintNoBallsStringProperty"] );
addToMapIfDefined( 'a11y_common_eraseButton_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["eraseButton"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_eraseButton_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["eraseButton"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_common_medianPredictionSlider_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["medianPredictionSlider"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_meanPredictionSlider_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["meanPredictionSlider"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_medianCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["medianCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_medianCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["medianCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_common_meanCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["meanCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_meanCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["meanCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_common_predictMedianCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["predictMedianCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_predictMedianCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["predictMedianCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_common_predictMeanCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["predictMeanCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_common_predictMeanCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["common"]?.["predictMeanCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_median_playArea', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["playAreaStringProperty"] );
addToMapIfDefined( 'a11y_median_controlArea', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["controlAreaStringProperty"] );
addToMapIfDefined( 'a11y_median_currentDetails_soccerBalls', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["currentDetails"]?.["soccerBallsStringProperty"] );
addToMapIfDefined( 'a11y_median_currentDetails_cards', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["currentDetails"]?.["cardsStringProperty"] );
addToMapIfDefined( 'a11y_median_interactionHintSomeBalls', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["interactionHintSomeBallsStringProperty"] );
addToMapIfDefined( 'a11y_median_distanceAccordionBox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["distanceAccordionBox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_median_dataCardsGroup_noCardsAccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["dataCardsGroup"]?.["noCardsAccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_median_dataCardsGroup_selectAccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["dataCardsGroup"]?.["selectAccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_median_dataCardsGroup_sortAccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["dataCardsGroup"]?.["sortAccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_median_dataCardsGroup_selectAccessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["dataCardsGroup"]?.["selectAccessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_median_dataCardsGroup_sortAccessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["dataCardsGroup"]?.["sortAccessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_median_sortDataCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["sortDataCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_median_sortDataCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["sortDataCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_median_cardsMedianCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["cardsMedianCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_median_cardsMedianCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["cardsMedianCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_median_details_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["median"]?.["details"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_playArea', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["playAreaStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_currentDetails_soccerBalls', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["currentDetails"]?.["soccerBallsStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_currentDetails_plot', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["currentDetails"]?.["plotStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_controlArea', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["controlAreaStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_accordionBoxHelpText', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["accordionBoxHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_plotMedianCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["plotMedianCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_plotMedianCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["plotMedianCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_plotMeanCheckbox_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["plotMeanCheckbox"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_plotMeanCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["plotMeanCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_details_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["details"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_meanAndMedian_interactionHintSomeBalls', CenterAndVariabilityStrings?.["a11y"]?.["meanAndMedian"]?.["interactionHintSomeBallsStringProperty"] );
addToMapIfDefined( 'a11y_variability_playArea', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["playAreaStringProperty"] );
addToMapIfDefined( 'a11y_variability_currentDetails_soccerBalls', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["currentDetails"]?.["soccerBallsStringProperty"] );
addToMapIfDefined( 'a11y_variability_currentDetails_measure', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["currentDetails"]?.["measureStringProperty"] );
addToMapIfDefined( 'a11y_variability_controlArea', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["controlAreaStringProperty"] );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_groupName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["sceneRadioButtonGroup"]?.["groupNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene1AccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["sceneRadioButtonGroup"]?.["scene1AccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene2AccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["sceneRadioButtonGroup"]?.["scene2AccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene3AccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["sceneRadioButtonGroup"]?.["scene3AccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene4AccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["sceneRadioButtonGroup"]?.["scene4AccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["sceneRadioButtonGroup"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_pointerCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["pointerCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_predictionPointer_accessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["predictionPointer"]?.["accessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_measuresRadioButtonGroup_groupName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["measuresRadioButtonGroup"]?.["groupNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_measuresRadioButtonGroup_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["measuresRadioButtonGroup"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_measureAccordionBox_rangeAccessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["measureAccordionBox"]?.["rangeAccessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_measureAccordionBox_iqrAccessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["measureAccordionBox"]?.["iqrAccessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_measureAccordionBox_madAccessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["measureAccordionBox"]?.["madAccessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_rangeCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["rangeCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_iqrCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["iqrCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_madCheckbox_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["madCheckbox"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_details_accessibleNamePattern', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["details"]?.["accessibleNamePatternStringProperty"] );
addToMapIfDefined( 'a11y_variability_intervalTool_heading', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["intervalTool"]?.["headingStringProperty"] );
addToMapIfDefined( 'a11y_variability_intervalTool_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["intervalTool"]?.["accessibleHelpTextStringProperty"] );
addToMapIfDefined( 'a11y_variability_intervalTool_handle1AccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["intervalTool"]?.["handle1AccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_intervalTool_handle2AccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["intervalTool"]?.["handle2AccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_intervalTool_rectangleAccessibleName', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["intervalTool"]?.["rectangleAccessibleNameStringProperty"] );
addToMapIfDefined( 'a11y_variability_intervalTool_rectangleValuePattern', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["intervalTool"]?.["rectangleValuePatternStringProperty"] );
addToMapIfDefined( 'a11y_variability_interactionHintSomeBalls', CenterAndVariabilityStrings?.["a11y"]?.["variability"]?.["interactionHintSomeBallsStringProperty"] );
addToMapIfDefined( 'a11y_preferences_plotType_accessibleHelpText', CenterAndVariabilityStrings?.["a11y"]?.["preferences"]?.["plotType"]?.["accessibleHelpTextStringProperty"] );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const CenterAndVariabilityFluent = {
  "center-and-variability": {
    titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'center_and_variability_title' )
  },
  screen: {
    medianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_median' ),
    meanAndMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_meanAndMedian' ),
    variabilityStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_variability' )
  },
  kickValuePatternStringProperty: CenterAndVariabilityStrings?.["kickValuePatternStringProperty"],
  distanceInMetersAccordionBoxTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersAccordionBoxTitle' ),
  distanceInMetersChartLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersChartLabel' ),
  meanEqualsValueMetersPatternStringProperty: CenterAndVariabilityStrings?.["meanEqualsValueMetersPatternStringProperty"],
  meanEqualsValueMPatternStringProperty: CenterAndVariabilityStrings?.["meanEqualsValueMPatternStringProperty"],
  meanEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanEqualsUnknown' ),
  medianEqualsValuePatternStringProperty: CenterAndVariabilityStrings?.["medianEqualsValuePatternStringProperty"],
  medianEqualsValueMPatternStringProperty: CenterAndVariabilityStrings?.["medianEqualsValueMPatternStringProperty"],
  medianEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianEqualsUnknown' ),
  medianEqualsValueUnitsPatternStringProperty: CenterAndVariabilityStrings?.["medianEqualsValueUnitsPatternStringProperty"],
  plotTypeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'plotType' ),
  dotPlotStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'dotPlot' ),
  linePlotStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'linePlot' ),
  medianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'median' ),
  meanStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'mean' ),
  meanEqualsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanEquals' ),
  valueUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'valueUnknown' ),
  metersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meters' ),
  meterStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meter' ),
  needAtLeastFiveKicksStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'needAtLeastFiveKicks' ),
  maxKicksStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'maxKicks' ),
  maxKicksDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'maxKicksDescription' ),
  outliersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'outliers' ),
  outliersDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'outliersDescription' ),
  valueKicksPatternStringProperty: CenterAndVariabilityStrings?.["valueKicksPatternStringProperty"],
  pointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'pointer' ),
  medianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianQuestion' ),
  sortDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'sortData' ),
  youSortedTheDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'youSortedTheData' ),
  medianDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianDescription' ),
  meanAndMedianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanAndMedianQuestion' ),
  meanDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanDescription' ),
  variabilityQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'variabilityQuestion' ),
  iqrEqualsValueMPatternStringProperty: CenterAndVariabilityStrings?.["iqrEqualsValueMPatternStringProperty"],
  iqrEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqrEqualsUnknown' ),
  rangeEqualsValueMPatternStringProperty: CenterAndVariabilityStrings?.["rangeEqualsValueMPatternStringProperty"],
  rangeEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rangeEqualsUnknown' ),
  madEqualsValueMPatternStringProperty: CenterAndVariabilityStrings?.["madEqualsValueMPatternStringProperty"],
  madEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madEqualsUnknown' ),
  madEqualsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madEquals' ),
  rangeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'range' ),
  interquartileRangeIQRStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'interquartileRangeIQR' ),
  iqrStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqr' ),
  minStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'min' ),
  maxStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'max' ),
  q1StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'q1' ),
  q3StringProperty: new FluentConstant( fluentSupport.bundleProperty, 'q3' ),
  meanAbsoluteDeviationMADStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanAbsoluteDeviationMAD' ),
  madStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'mad' ),
  intervalToolStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'intervalTool' ),
  predictMeanStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'predictMean' ),
  predictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'predictMedian' ),
  rangeDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rangeDescription' ),
  iqrDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqrDescription' ),
  dataValuesInMetersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'dataValuesInMeters' ),
  iqrEqualsQ3MinusQ3PatternStringProperty: CenterAndVariabilityStrings?.["iqrEqualsQ3MinusQ3PatternStringProperty"],
  iqrEqualsIQRUnitsPatternStringProperty: CenterAndVariabilityStrings?.["iqrEqualsIQRUnitsPatternStringProperty"],
  madDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madDescription' ),
  madEqualsMADMetersPatternStringProperty: CenterAndVariabilityStrings?.["madEqualsMADMetersPatternStringProperty"],
  rangeEqualsMaxMinusMinPatternStringProperty: CenterAndVariabilityStrings?.["rangeEqualsMaxMinusMinPatternStringProperty"],
  rangeEqualsRangeUnitsPatternStringProperty: CenterAndVariabilityStrings?.["rangeEqualsRangeUnitsPatternStringProperty"],
  keyboardHelpDialog: {
    moveStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_move' ),
    endOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_endOfNumberLine' ),
    startOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_startOfNumberLine' ),
    grabOrReleaseBallStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_grabOrReleaseBall' ),
    moveGrabbedBallTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveGrabbedBallTitle' ),
    moveGrabbedBallStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveGrabbedBall' ),
    grabOrReleaseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_grabOrRelease' ),
    jumpToStartOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpToStartOfNumberLine' ),
    jumpToEndOfNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpToEndOfNumberLine' ),
    jumpBallToTickMarkStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpBallToTickMark' ),
    moveInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveInLargerSteps' ),
    medianScreen: {
      grabOrReleaseBallOrCardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_grabOrReleaseBallOrCard' ),
      movePredictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_movePredictMedian' ),
      predictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_predictMedian' ),
      moveGrabbedBallOrCardTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCardTitle' ),
      moveGrabbedBallOrCardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCard' ),
      jumpToStartOfCardsOrNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_jumpToStartOfCardsOrNumberLine' ),
      jumpToEndOfCardsOrNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_jumpToEndOfCardsOrNumberLine' )
    },
    meanAndMedianScreen: {
      movePredictMeanOrMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanOrMedian' ),
      movePredictionPointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictionPointer' ),
      movePredictMeanInSmallerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanInSmallerSteps' ),
      moveInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_moveInLargerSteps' )
    },
    variabilityScreen: {
      movePointerIntervalHandleOrIntervalBlockStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_variabilityScreen_movePointerIntervalHandleOrIntervalBlock' ),
      objectStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_variabilityScreen_object' )
    }
  },
  a11y: {
    medianScreenHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreenHelpText' ),
    meanAndMedianScreenHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreenHelpText' ),
    variabilityScreenHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreenHelpText' ),
    common: {
      currentDetails: {
        listItemPattern: new FluentPattern<{ distance: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_common_currentDetails_listItemPattern' )
      },
      guidingQuestion: new FluentPattern<{ question: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_common_guidingQuestion' ),
      soccerFieldStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_soccerField' ),
      interactionHintNoBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_interactionHintNoBalls' ),
      eraseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_eraseButton_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_eraseButton_accessibleHelpText' )
      },
      medianPredictionSlider: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_medianPredictionSlider_accessibleName' )
      },
      meanPredictionSlider: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_meanPredictionSlider_accessibleName' )
      },
      medianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_medianCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_medianCheckbox_accessibleHelpText' )
      },
      meanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_meanCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_meanCheckbox_accessibleHelpText' )
      },
      predictMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMedianCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMedianCheckbox_accessibleHelpText' )
      },
      predictMeanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMeanCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMeanCheckbox_accessibleHelpText' )
      }
    },
    median: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_playArea' ),
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_controlArea' ),
      currentDetails: {
        soccerBalls: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_currentDetails_soccerBalls' ),
        cards: new FluentPattern<{ distances: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_currentDetails_cards' )
      },
      interactionHintSomeBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_interactionHintSomeBalls' ),
      distanceAccordionBox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_distanceAccordionBox_accessibleName' )
      },
      dataCardsGroup: {
        noCardsAccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_noCardsAccessibleName' ),
        selectAccessibleName: new FluentPattern<{ index: FluentVariable, total: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_selectAccessibleName' ),
        sortAccessibleName: new FluentPattern<{ index: FluentVariable, total: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_sortAccessibleName' ),
        selectAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_selectAccessibleHelpText' ),
        sortAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_sortAccessibleHelpText' )
      },
      sortDataCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_sortDataCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_sortDataCheckbox_accessibleHelpText' )
      },
      cardsMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_cardsMedianCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_cardsMedianCheckbox_accessibleHelpText' )
      },
      details: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_details_accessibleName' )
      }
    },
    meanAndMedian: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedian_playArea' ),
      currentDetails: {
        soccerBalls: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedian_currentDetails_soccerBalls' ),
        plot: new FluentPattern<{ number: FluentVariable, plotType: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedian_currentDetails_plot' )
      },
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_controlArea' ),
      accordionBoxHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_accordionBoxHelpText' ),
      plotMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMedianCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMedianCheckbox_accessibleHelpText' )
      },
      plotMeanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMeanCheckbox_accessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMeanCheckbox_accessibleHelpText' )
      },
      details: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_details_accessibleName' )
      },
      interactionHintSomeBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_interactionHintSomeBalls' )
    },
    variability: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_playArea' ),
      currentDetails: {
        soccerBalls: new FluentPattern<{ kicker: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_currentDetails_soccerBalls' ),
        measure: new FluentPattern<{ measure: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_currentDetails_measure' )
      },
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_controlArea' ),
      sceneRadioButtonGroup: {
        groupNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_groupName' ),
        scene1AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene1AccessibleName' ),
        scene2AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene2AccessibleName' ),
        scene3AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene3AccessibleName' ),
        scene4AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene4AccessibleName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_accessibleHelpText' )
      },
      pointerCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_pointerCheckbox_accessibleHelpText' )
      },
      predictionPointer: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_predictionPointer_accessibleName' )
      },
      measuresRadioButtonGroup: {
        groupNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measuresRadioButtonGroup_groupName' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measuresRadioButtonGroup_accessibleHelpText' )
      },
      measureAccordionBox: {
        rangeAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measureAccordionBox_rangeAccessibleHelpText' ),
        iqrAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measureAccordionBox_iqrAccessibleHelpText' ),
        madAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measureAccordionBox_madAccessibleHelpText' )
      },
      rangeCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_rangeCheckbox_accessibleHelpText' )
      },
      iqrCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_iqrCheckbox_accessibleHelpText' )
      },
      madCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_madCheckbox_accessibleHelpText' )
      },
      details: {
        accessibleNamePattern: new FluentPattern<{ measure: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_details_accessibleNamePattern' )
      },
      intervalTool: {
        headingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_heading' ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_accessibleHelpText' ),
        handle1AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_handle1AccessibleName' ),
        handle2AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_handle2AccessibleName' ),
        rectangleAccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_rectangleAccessibleName' ),
        rectangleValuePattern: new FluentPattern<{ valueA: FluentVariable, valueB: FluentVariable, width: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_rectangleValuePattern' )
      },
      interactionHintSomeBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_interactionHintSomeBalls' )
    },
    preferences: {
      plotType: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_preferences_plotType_accessibleHelpText' )
      }
    }
  }
};

export default CenterAndVariabilityFluent;

centerAndVariability.register('CenterAndVariabilityFluent', CenterAndVariabilityFluent);
