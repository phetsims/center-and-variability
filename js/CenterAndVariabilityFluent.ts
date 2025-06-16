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
addToMapIfDefined( 'a11y_medianScreenHelpText', 'a11y.medianScreenHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedianScreenHelpText', 'a11y.meanAndMedianScreenHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variabilityScreenHelpText', 'a11y.variabilityScreenHelpTextStringProperty' );
addToMapIfDefined( 'a11y_common_currentDetails_listItemPattern', 'a11y.common.currentDetails.listItemPatternStringProperty' );
addToMapIfDefined( 'a11y_common_guidingQuestion', 'a11y.common.guidingQuestionStringProperty' );
addToMapIfDefined( 'a11y_common_soccerField', 'a11y.common.soccerFieldStringProperty' );
addToMapIfDefined( 'a11y_common_interactionHintNoBalls', 'a11y.common.interactionHintNoBallsStringProperty' );
addToMapIfDefined( 'a11y_common_eraseButton_accessibleName', 'a11y.common.eraseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_eraseButton_accessibleHelpText', 'a11y.common.eraseButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_common_medianPredictionSlider_accessibleName', 'a11y.common.medianPredictionSlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_meanPredictionSlider_accessibleName', 'a11y.common.meanPredictionSlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_medianCheckbox_accessibleName', 'a11y.common.medianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_medianCheckbox_accessibleHelpText', 'a11y.common.medianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_common_meanCheckbox_accessibleName', 'a11y.common.meanCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_meanCheckbox_accessibleHelpText', 'a11y.common.meanCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_common_predictMedianCheckbox_accessibleName', 'a11y.common.predictMedianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_predictMedianCheckbox_accessibleHelpText', 'a11y.common.predictMedianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_common_predictMeanCheckbox_accessibleName', 'a11y.common.predictMeanCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_common_predictMeanCheckbox_accessibleHelpText', 'a11y.common.predictMeanCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_median_playArea', 'a11y.median.playAreaStringProperty' );
addToMapIfDefined( 'a11y_median_controlArea', 'a11y.median.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_median_currentDetails_soccerBalls', 'a11y.median.currentDetails.soccerBallsStringProperty' );
addToMapIfDefined( 'a11y_median_currentDetails_cards', 'a11y.median.currentDetails.cardsStringProperty' );
addToMapIfDefined( 'a11y_median_interactionHintSomeBalls', 'a11y.median.interactionHintSomeBallsStringProperty' );
addToMapIfDefined( 'a11y_median_dataCardsGroup_noCardsAccessibleName', 'a11y.median.dataCardsGroup.noCardsAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_median_dataCardsGroup_selectAccessibleName', 'a11y.median.dataCardsGroup.selectAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_median_dataCardsGroup_sortAccessibleName', 'a11y.median.dataCardsGroup.sortAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_median_dataCardsGroup_selectAccessibleHelpText', 'a11y.median.dataCardsGroup.selectAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_median_dataCardsGroup_sortAccessibleHelpText', 'a11y.median.dataCardsGroup.sortAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_median_sortDataCheckbox_accessibleName', 'a11y.median.sortDataCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_median_sortDataCheckbox_accessibleHelpText', 'a11y.median.sortDataCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_median_cardsMedianCheckbox_accessibleName', 'a11y.median.cardsMedianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_median_cardsMedianCheckbox_accessibleHelpText', 'a11y.median.cardsMedianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_median_details_accessibleName', 'a11y.median.details.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_playArea', 'a11y.meanAndMedian.playAreaStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_currentDetails_soccerBalls', 'a11y.meanAndMedian.currentDetails.soccerBallsStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_currentDetails_plot', 'a11y.meanAndMedian.currentDetails.plotStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_controlArea', 'a11y.meanAndMedian.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_accordionBoxHelpText', 'a11y.meanAndMedian.accordionBoxHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_plotMedianCheckbox_accessibleName', 'a11y.meanAndMedian.plotMedianCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_plotMedianCheckbox_accessibleHelpText', 'a11y.meanAndMedian.plotMedianCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_plotMeanCheckbox_accessibleName', 'a11y.meanAndMedian.plotMeanCheckbox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_plotMeanCheckbox_accessibleHelpText', 'a11y.meanAndMedian.plotMeanCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_details_accessibleName', 'a11y.meanAndMedian.details.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_meanAndMedian_interactionHintSomeBalls', 'a11y.meanAndMedian.interactionHintSomeBallsStringProperty' );
addToMapIfDefined( 'a11y_variability_playArea', 'a11y.variability.playAreaStringProperty' );
addToMapIfDefined( 'a11y_variability_currentDetails_soccerBalls', 'a11y.variability.currentDetails.soccerBallsStringProperty' );
addToMapIfDefined( 'a11y_variability_currentDetails_plot', 'a11y.variability.currentDetails.plotStringProperty' );
addToMapIfDefined( 'a11y_variability_controlArea', 'a11y.variability.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_groupName', 'a11y.variability.sceneRadioButtonGroup.groupNameStringProperty' );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene1AccessibleName', 'a11y.variability.sceneRadioButtonGroup.scene1AccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene2AccessibleName', 'a11y.variability.sceneRadioButtonGroup.scene2AccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene3AccessibleName', 'a11y.variability.sceneRadioButtonGroup.scene3AccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_scene4AccessibleName', 'a11y.variability.sceneRadioButtonGroup.scene4AccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_sceneRadioButtonGroup_accessibleHelpText', 'a11y.variability.sceneRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_pointerCheckbox_accessibleHelpText', 'a11y.variability.pointerCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_predictionPointer_accessibleName', 'a11y.variability.predictionPointer.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_measuresRadioButtonGroup_groupName', 'a11y.variability.measuresRadioButtonGroup.groupNameStringProperty' );
addToMapIfDefined( 'a11y_variability_measuresRadioButtonGroup_accessibleHelpText', 'a11y.variability.measuresRadioButtonGroup.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_measureAccordionBox_rangeAccessibleHelpText', 'a11y.variability.measureAccordionBox.rangeAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_measureAccordionBox_iqrAccessibleHelpText', 'a11y.variability.measureAccordionBox.iqrAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_measureAccordionBox_madAccessibleHelpText', 'a11y.variability.measureAccordionBox.madAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_rangeCheckbox_accessibleHelpText', 'a11y.variability.rangeCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_iqrCheckbox_accessibleHelpText', 'a11y.variability.iqrCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_madCheckbox_accessibleHelpText', 'a11y.variability.madCheckbox.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_details_accessibleNamePattern', 'a11y.variability.details.accessibleNamePatternStringProperty' );
addToMapIfDefined( 'a11y_variability_intervalTool_heading', 'a11y.variability.intervalTool.headingStringProperty' );
addToMapIfDefined( 'a11y_variability_intervalTool_accessibleHelpText', 'a11y.variability.intervalTool.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_variability_intervalTool_handle1AccessibleName', 'a11y.variability.intervalTool.handle1AccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_intervalTool_handle2AccessibleName', 'a11y.variability.intervalTool.handle2AccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_intervalTool_rectangleAccessibleName', 'a11y.variability.intervalTool.rectangleAccessibleNameStringProperty' );
addToMapIfDefined( 'a11y_variability_intervalTool_rectangleValuePattern', 'a11y.variability.intervalTool.rectangleValuePatternStringProperty' );
addToMapIfDefined( 'a11y_variability_interactionHintSomeBalls', 'a11y.variability.interactionHintSomeBallsStringProperty' );
addToMapIfDefined( 'a11y_preferences_plotType_accessibleHelpText', 'a11y.preferences.plotType.accessibleHelpTextStringProperty' );

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
    titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'center_and_variability_title', _.get( CenterAndVariabilityStrings, 'center-and-variability.titleStringProperty' ) )
  },
  screen: {
    medianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_median', _.get( CenterAndVariabilityStrings, 'screen.medianStringProperty' ) ),
    meanAndMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_meanAndMedian', _.get( CenterAndVariabilityStrings, 'screen.meanAndMedianStringProperty' ) ),
    variabilityStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_variability', _.get( CenterAndVariabilityStrings, 'screen.variabilityStringProperty' ) )
  },
  kickValuePatternStringProperty: _.get( CenterAndVariabilityStrings, 'kickValuePatternStringProperty' ) ,
  distanceInMetersAccordionBoxTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersAccordionBoxTitle', _.get( CenterAndVariabilityStrings, 'distanceInMetersAccordionBoxTitleStringProperty' ) ),
  distanceInMetersChartLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersChartLabel', _.get( CenterAndVariabilityStrings, 'distanceInMetersChartLabelStringProperty' ) ),
  meanEqualsValueMetersPatternStringProperty: _.get( CenterAndVariabilityStrings, 'meanEqualsValueMetersPatternStringProperty' ) ,
  meanEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'meanEqualsValueMPatternStringProperty' ) ,
  meanEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanEqualsUnknown', _.get( CenterAndVariabilityStrings, 'meanEqualsUnknownStringProperty' ) ),
  medianEqualsValuePatternStringProperty: _.get( CenterAndVariabilityStrings, 'medianEqualsValuePatternStringProperty' ) ,
  medianEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'medianEqualsValueMPatternStringProperty' ) ,
  medianEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianEqualsUnknown', _.get( CenterAndVariabilityStrings, 'medianEqualsUnknownStringProperty' ) ),
  medianEqualsValueUnitsPatternStringProperty: _.get( CenterAndVariabilityStrings, 'medianEqualsValueUnitsPatternStringProperty' ) ,
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
  valueKicksPatternStringProperty: _.get( CenterAndVariabilityStrings, 'valueKicksPatternStringProperty' ) ,
  pointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'pointer', _.get( CenterAndVariabilityStrings, 'pointerStringProperty' ) ),
  medianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianQuestion', _.get( CenterAndVariabilityStrings, 'medianQuestionStringProperty' ) ),
  sortDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'sortData', _.get( CenterAndVariabilityStrings, 'sortDataStringProperty' ) ),
  youSortedTheDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'youSortedTheData', _.get( CenterAndVariabilityStrings, 'youSortedTheDataStringProperty' ) ),
  medianDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianDescription', _.get( CenterAndVariabilityStrings, 'medianDescriptionStringProperty' ) ),
  meanAndMedianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanAndMedianQuestion', _.get( CenterAndVariabilityStrings, 'meanAndMedianQuestionStringProperty' ) ),
  meanDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanDescription', _.get( CenterAndVariabilityStrings, 'meanDescriptionStringProperty' ) ),
  variabilityQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'variabilityQuestion', _.get( CenterAndVariabilityStrings, 'variabilityQuestionStringProperty' ) ),
  iqrEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'iqrEqualsValueMPatternStringProperty' ) ,
  iqrEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqrEqualsUnknown', _.get( CenterAndVariabilityStrings, 'iqrEqualsUnknownStringProperty' ) ),
  rangeEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'rangeEqualsValueMPatternStringProperty' ) ,
  rangeEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rangeEqualsUnknown', _.get( CenterAndVariabilityStrings, 'rangeEqualsUnknownStringProperty' ) ),
  madEqualsValueMPatternStringProperty: _.get( CenterAndVariabilityStrings, 'madEqualsValueMPatternStringProperty' ) ,
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
  iqrEqualsQ3MinusQ3PatternStringProperty: _.get( CenterAndVariabilityStrings, 'iqrEqualsQ3MinusQ3PatternStringProperty' ) ,
  iqrEqualsIQRUnitsPatternStringProperty: _.get( CenterAndVariabilityStrings, 'iqrEqualsIQRUnitsPatternStringProperty' ) ,
  madDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madDescription', _.get( CenterAndVariabilityStrings, 'madDescriptionStringProperty' ) ),
  madEqualsMADMetersPatternStringProperty: _.get( CenterAndVariabilityStrings, 'madEqualsMADMetersPatternStringProperty' ) ,
  rangeEqualsMaxMinusMinPatternStringProperty: _.get( CenterAndVariabilityStrings, 'rangeEqualsMaxMinusMinPatternStringProperty' ) ,
  rangeEqualsRangeUnitsPatternStringProperty: _.get( CenterAndVariabilityStrings, 'rangeEqualsRangeUnitsPatternStringProperty' ) ,
  keyboardHelpDialog: {
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
    medianScreen: {
      grabOrReleaseBallOrCardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_grabOrReleaseBallOrCard', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty' ) ),
      movePredictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_movePredictMedian', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.movePredictMedianStringProperty' ) ),
      predictMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_predictMedian', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.predictMedianStringProperty' ) ),
      moveGrabbedBallOrCardTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCardTitle', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty' ) ),
      moveGrabbedBallOrCardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_moveGrabbedBallOrCard', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty' ) ),
      jumpToStartOfCardsOrNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_jumpToStartOfCardsOrNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty' ) ),
      jumpToEndOfCardsOrNumberLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_medianScreen_jumpToEndOfCardsOrNumberLine', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty' ) )
    },
    meanAndMedianScreen: {
      movePredictMeanOrMedianStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanOrMedian', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.movePredictMeanOrMedianStringProperty' ) ),
      movePredictionPointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictionPointer', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty' ) ),
      movePredictMeanInSmallerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_movePredictMeanInSmallerSteps', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.movePredictMeanInSmallerStepsStringProperty' ) ),
      moveInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_meanAndMedianScreen_moveInLargerSteps', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.meanAndMedianScreen.moveInLargerStepsStringProperty' ) )
    },
    variabilityScreen: {
      movePointerIntervalHandleOrIntervalBlockStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_variabilityScreen_movePointerIntervalHandleOrIntervalBlock', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.variabilityScreen.movePointerIntervalHandleOrIntervalBlockStringProperty' ) ),
      objectStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_variabilityScreen_object', _.get( CenterAndVariabilityStrings, 'keyboardHelpDialog.variabilityScreen.objectStringProperty' ) )
    }
  },
  a11y: {
    medianScreenHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_medianScreenHelpText', _.get( CenterAndVariabilityStrings, 'a11y.medianScreenHelpTextStringProperty' ) ),
    meanAndMedianScreenHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedianScreenHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedianScreenHelpTextStringProperty' ) ),
    variabilityScreenHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variabilityScreenHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variabilityScreenHelpTextStringProperty' ) ),
    common: {
      currentDetails: {
        listItemPattern: new FluentPattern<{ distance: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_common_currentDetails_listItemPattern', _.get( CenterAndVariabilityStrings, 'a11y.common.currentDetails.listItemPatternStringProperty' ) )
      },
      guidingQuestion: new FluentPattern<{ question: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_common_guidingQuestion', _.get( CenterAndVariabilityStrings, 'a11y.common.guidingQuestionStringProperty' ) ),
      soccerFieldStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_soccerField', _.get( CenterAndVariabilityStrings, 'a11y.common.soccerFieldStringProperty' ) ),
      interactionHintNoBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_interactionHintNoBalls', _.get( CenterAndVariabilityStrings, 'a11y.common.interactionHintNoBallsStringProperty' ) ),
      eraseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_eraseButton_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.eraseButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_eraseButton_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.common.eraseButton.accessibleHelpTextStringProperty' ) )
      },
      medianPredictionSlider: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_medianPredictionSlider_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.medianPredictionSlider.accessibleNameStringProperty' ) )
      },
      meanPredictionSlider: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_meanPredictionSlider_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.meanPredictionSlider.accessibleNameStringProperty' ) )
      },
      medianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_medianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.medianCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_medianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.common.medianCheckbox.accessibleHelpTextStringProperty' ) )
      },
      meanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_meanCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.meanCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_meanCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.common.meanCheckbox.accessibleHelpTextStringProperty' ) )
      },
      predictMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMedianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.predictMedianCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMedianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.common.predictMedianCheckbox.accessibleHelpTextStringProperty' ) )
      },
      predictMeanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMeanCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.common.predictMeanCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_common_predictMeanCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.common.predictMeanCheckbox.accessibleHelpTextStringProperty' ) )
      }
    },
    median: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_playArea', _.get( CenterAndVariabilityStrings, 'a11y.median.playAreaStringProperty' ) ),
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_controlArea', _.get( CenterAndVariabilityStrings, 'a11y.median.controlAreaStringProperty' ) ),
      currentDetails: {
        soccerBalls: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_currentDetails_soccerBalls', _.get( CenterAndVariabilityStrings, 'a11y.median.currentDetails.soccerBallsStringProperty' ) ),
        cards: new FluentPattern<{ distances: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_currentDetails_cards', _.get( CenterAndVariabilityStrings, 'a11y.median.currentDetails.cardsStringProperty' ) )
      },
      interactionHintSomeBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_interactionHintSomeBalls', _.get( CenterAndVariabilityStrings, 'a11y.median.interactionHintSomeBallsStringProperty' ) ),
      dataCardsGroup: {
        noCardsAccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_noCardsAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.median.dataCardsGroup.noCardsAccessibleNameStringProperty' ) ),
        selectAccessibleName: new FluentPattern<{ index: FluentVariable, total: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_selectAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.median.dataCardsGroup.selectAccessibleNameStringProperty' ) ),
        sortAccessibleName: new FluentPattern<{ index: FluentVariable, total: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_sortAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.median.dataCardsGroup.sortAccessibleNameStringProperty' ) ),
        selectAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_selectAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.median.dataCardsGroup.selectAccessibleHelpTextStringProperty' ) ),
        sortAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_dataCardsGroup_sortAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.median.dataCardsGroup.sortAccessibleHelpTextStringProperty' ) )
      },
      sortDataCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_sortDataCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.median.sortDataCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_sortDataCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.median.sortDataCheckbox.accessibleHelpTextStringProperty' ) )
      },
      cardsMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_cardsMedianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.median.cardsMedianCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_cardsMedianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.median.cardsMedianCheckbox.accessibleHelpTextStringProperty' ) )
      },
      details: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_median_details_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.median.details.accessibleNameStringProperty' ) )
      }
    },
    meanAndMedian: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedian_playArea', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.playAreaStringProperty' ) ),
      currentDetails: {
        soccerBalls: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedian_currentDetails_soccerBalls', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.currentDetails.soccerBallsStringProperty' ) ),
        plot: new FluentPattern<{ number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_meanAndMedian_currentDetails_plot', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.currentDetails.plotStringProperty' ) )
      },
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_controlArea', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.controlAreaStringProperty' ) ),
      accordionBoxHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_accordionBoxHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.accordionBoxHelpTextStringProperty' ) ),
      plotMedianCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMedianCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.plotMedianCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMedianCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.plotMedianCheckbox.accessibleHelpTextStringProperty' ) )
      },
      plotMeanCheckbox: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMeanCheckbox_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.plotMeanCheckbox.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_plotMeanCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.plotMeanCheckbox.accessibleHelpTextStringProperty' ) )
      },
      details: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_details_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.details.accessibleNameStringProperty' ) )
      },
      interactionHintSomeBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_meanAndMedian_interactionHintSomeBalls', _.get( CenterAndVariabilityStrings, 'a11y.meanAndMedian.interactionHintSomeBallsStringProperty' ) )
    },
    variability: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_playArea', _.get( CenterAndVariabilityStrings, 'a11y.variability.playAreaStringProperty' ) ),
      currentDetails: {
        soccerBalls: new FluentPattern<{ kicker: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_currentDetails_soccerBalls', _.get( CenterAndVariabilityStrings, 'a11y.variability.currentDetails.soccerBallsStringProperty' ) ),
        plot: new FluentPattern<{ measure: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_currentDetails_plot', _.get( CenterAndVariabilityStrings, 'a11y.variability.currentDetails.plotStringProperty' ) )
      },
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_controlArea', _.get( CenterAndVariabilityStrings, 'a11y.variability.controlAreaStringProperty' ) ),
      sceneRadioButtonGroup: {
        groupNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_groupName', _.get( CenterAndVariabilityStrings, 'a11y.variability.sceneRadioButtonGroup.groupNameStringProperty' ) ),
        scene1AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene1AccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.sceneRadioButtonGroup.scene1AccessibleNameStringProperty' ) ),
        scene2AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene2AccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.sceneRadioButtonGroup.scene2AccessibleNameStringProperty' ) ),
        scene3AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene3AccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.sceneRadioButtonGroup.scene3AccessibleNameStringProperty' ) ),
        scene4AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_scene4AccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.sceneRadioButtonGroup.scene4AccessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_sceneRadioButtonGroup_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.sceneRadioButtonGroup.accessibleHelpTextStringProperty' ) )
      },
      pointerCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_pointerCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.pointerCheckbox.accessibleHelpTextStringProperty' ) )
      },
      predictionPointer: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_predictionPointer_accessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.predictionPointer.accessibleNameStringProperty' ) )
      },
      measuresRadioButtonGroup: {
        groupNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measuresRadioButtonGroup_groupName', _.get( CenterAndVariabilityStrings, 'a11y.variability.measuresRadioButtonGroup.groupNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measuresRadioButtonGroup_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.measuresRadioButtonGroup.accessibleHelpTextStringProperty' ) )
      },
      measureAccordionBox: {
        rangeAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measureAccordionBox_rangeAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.measureAccordionBox.rangeAccessibleHelpTextStringProperty' ) ),
        iqrAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measureAccordionBox_iqrAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.measureAccordionBox.iqrAccessibleHelpTextStringProperty' ) ),
        madAccessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_measureAccordionBox_madAccessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.measureAccordionBox.madAccessibleHelpTextStringProperty' ) )
      },
      rangeCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_rangeCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.rangeCheckbox.accessibleHelpTextStringProperty' ) )
      },
      iqrCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_iqrCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.iqrCheckbox.accessibleHelpTextStringProperty' ) )
      },
      madCheckbox: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_madCheckbox_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.madCheckbox.accessibleHelpTextStringProperty' ) )
      },
      details: {
        accessibleNamePattern: new FluentPattern<{ measure: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_details_accessibleNamePattern', _.get( CenterAndVariabilityStrings, 'a11y.variability.details.accessibleNamePatternStringProperty' ) )
      },
      intervalTool: {
        headingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_heading', _.get( CenterAndVariabilityStrings, 'a11y.variability.intervalTool.headingStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.variability.intervalTool.accessibleHelpTextStringProperty' ) ),
        handle1AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_handle1AccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.intervalTool.handle1AccessibleNameStringProperty' ) ),
        handle2AccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_handle2AccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.intervalTool.handle2AccessibleNameStringProperty' ) ),
        rectangleAccessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_rectangleAccessibleName', _.get( CenterAndVariabilityStrings, 'a11y.variability.intervalTool.rectangleAccessibleNameStringProperty' ) ),
        rectangleValuePattern: new FluentPattern<{ valueA: FluentVariable, valueB: FluentVariable, width: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_intervalTool_rectangleValuePattern', _.get( CenterAndVariabilityStrings, 'a11y.variability.intervalTool.rectangleValuePatternStringProperty' ) )
      },
      interactionHintSomeBallsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_variability_interactionHintSomeBalls', _.get( CenterAndVariabilityStrings, 'a11y.variability.interactionHintSomeBallsStringProperty' ) )
    },
    preferences: {
      plotType: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_preferences_plotType_accessibleHelpText', _.get( CenterAndVariabilityStrings, 'a11y.preferences.plotType.accessibleHelpTextStringProperty' ) )
      }
    }
  }
};

export default CenterAndVariabilityFluent;

centerAndVariability.register('CenterAndVariabilityFluent', CenterAndVariabilityFluent);
