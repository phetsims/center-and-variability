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
const fluentKeyToStringPropertyMap = new Map( [
  ['center_and_variability_title', CenterAndVariabilityStrings["center-and-variability"].titleStringProperty],
  ['screen_median', CenterAndVariabilityStrings.screen.medianStringProperty],
  ['screen_meanAndMedian', CenterAndVariabilityStrings.screen.meanAndMedianStringProperty],
  ['screen_variability', CenterAndVariabilityStrings.screen.variabilityStringProperty],
  ['distanceInMetersAccordionBoxTitle', CenterAndVariabilityStrings.distanceInMetersAccordionBoxTitleStringProperty],
  ['distanceInMetersChartLabel', CenterAndVariabilityStrings.distanceInMetersChartLabelStringProperty],
  ['meanEqualsUnknown', CenterAndVariabilityStrings.meanEqualsUnknownStringProperty],
  ['medianEqualsUnknown', CenterAndVariabilityStrings.medianEqualsUnknownStringProperty],
  ['plotType', CenterAndVariabilityStrings.plotTypeStringProperty],
  ['dotPlot', CenterAndVariabilityStrings.dotPlotStringProperty],
  ['linePlot', CenterAndVariabilityStrings.linePlotStringProperty],
  ['median', CenterAndVariabilityStrings.medianStringProperty],
  ['mean', CenterAndVariabilityStrings.meanStringProperty],
  ['meanEquals', CenterAndVariabilityStrings.meanEqualsStringProperty],
  ['valueUnknown', CenterAndVariabilityStrings.valueUnknownStringProperty],
  ['meters', CenterAndVariabilityStrings.metersStringProperty],
  ['meter', CenterAndVariabilityStrings.meterStringProperty],
  ['needAtLeastFiveKicks', CenterAndVariabilityStrings.needAtLeastFiveKicksStringProperty],
  ['maxKicks', CenterAndVariabilityStrings.maxKicksStringProperty],
  ['maxKicksDescription', CenterAndVariabilityStrings.maxKicksDescriptionStringProperty],
  ['outliers', CenterAndVariabilityStrings.outliersStringProperty],
  ['outliersDescription', CenterAndVariabilityStrings.outliersDescriptionStringProperty],
  ['pointer', CenterAndVariabilityStrings.pointerStringProperty],
  ['medianQuestion', CenterAndVariabilityStrings.medianQuestionStringProperty],
  ['sortData', CenterAndVariabilityStrings.sortDataStringProperty],
  ['youSortedTheData', CenterAndVariabilityStrings.youSortedTheDataStringProperty],
  ['medianDescription', CenterAndVariabilityStrings.medianDescriptionStringProperty],
  ['meanAndMedianQuestion', CenterAndVariabilityStrings.meanAndMedianQuestionStringProperty],
  ['meanDescription', CenterAndVariabilityStrings.meanDescriptionStringProperty],
  ['variabilityQuestion', CenterAndVariabilityStrings.variabilityQuestionStringProperty],
  ['iqrEqualsUnknown', CenterAndVariabilityStrings.iqrEqualsUnknownStringProperty],
  ['rangeEqualsUnknown', CenterAndVariabilityStrings.rangeEqualsUnknownStringProperty],
  ['madEqualsUnknown', CenterAndVariabilityStrings.madEqualsUnknownStringProperty],
  ['madEquals', CenterAndVariabilityStrings.madEqualsStringProperty],
  ['range', CenterAndVariabilityStrings.rangeStringProperty],
  ['interquartileRangeIQR', CenterAndVariabilityStrings.interquartileRangeIQRStringProperty],
  ['iqr', CenterAndVariabilityStrings.iqrStringProperty],
  ['min', CenterAndVariabilityStrings.minStringProperty],
  ['max', CenterAndVariabilityStrings.maxStringProperty],
  ['q1', CenterAndVariabilityStrings.q1StringProperty],
  ['q3', CenterAndVariabilityStrings.q3StringProperty],
  ['meanAbsoluteDeviationMAD', CenterAndVariabilityStrings.meanAbsoluteDeviationMADStringProperty],
  ['mad', CenterAndVariabilityStrings.madStringProperty],
  ['intervalTool', CenterAndVariabilityStrings.intervalToolStringProperty],
  ['predictMean', CenterAndVariabilityStrings.predictMeanStringProperty],
  ['predictMedian', CenterAndVariabilityStrings.predictMedianStringProperty],
  ['rangeDescription', CenterAndVariabilityStrings.rangeDescriptionStringProperty],
  ['iqrDescription', CenterAndVariabilityStrings.iqrDescriptionStringProperty],
  ['dataValuesInMeters', CenterAndVariabilityStrings.dataValuesInMetersStringProperty],
  ['madDescription', CenterAndVariabilityStrings.madDescriptionStringProperty],
  ['keyboardHelpDialog_move', CenterAndVariabilityStrings.keyboardHelpDialog.moveStringProperty],
  ['keyboardHelpDialog_endOfNumberLine', CenterAndVariabilityStrings.keyboardHelpDialog.endOfNumberLineStringProperty],
  ['keyboardHelpDialog_startOfNumberLine', CenterAndVariabilityStrings.keyboardHelpDialog.startOfNumberLineStringProperty],
  ['keyboardHelpDialog_grabOrReleaseBall', CenterAndVariabilityStrings.keyboardHelpDialog.grabOrReleaseBallStringProperty],
  ['keyboardHelpDialog_moveGrabbedBallTitle', CenterAndVariabilityStrings.keyboardHelpDialog.moveGrabbedBallTitleStringProperty],
  ['keyboardHelpDialog_moveGrabbedBall', CenterAndVariabilityStrings.keyboardHelpDialog.moveGrabbedBallStringProperty],
  ['keyboardHelpDialog_grabOrRelease', CenterAndVariabilityStrings.keyboardHelpDialog.grabOrReleaseStringProperty],
  ['keyboardHelpDialog_jumpToStartOfNumberLine', CenterAndVariabilityStrings.keyboardHelpDialog.jumpToStartOfNumberLineStringProperty],
  ['keyboardHelpDialog_jumpToEndOfNumberLine', CenterAndVariabilityStrings.keyboardHelpDialog.jumpToEndOfNumberLineStringProperty],
  ['keyboardHelpDialog_jumpBallToTickMark', CenterAndVariabilityStrings.keyboardHelpDialog.jumpBallToTickMarkStringProperty],
  ['keyboardHelpDialog_moveInLargerSteps', CenterAndVariabilityStrings.keyboardHelpDialog.moveInLargerStepsStringProperty],
  ['keyboardHelpDialog_medianScreen_grabOrReleaseBallOrCard', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.grabOrReleaseBallOrCardStringProperty],
  ['keyboardHelpDialog_medianScreen_movePredictMedian', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.movePredictMedianStringProperty],
  ['keyboardHelpDialog_medianScreen_predictMedian', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.predictMedianStringProperty],
  ['keyboardHelpDialog_medianScreen_moveGrabbedBallOrCardTitle', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardTitleStringProperty],
  ['keyboardHelpDialog_medianScreen_moveGrabbedBallOrCard', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.moveGrabbedBallOrCardStringProperty],
  ['keyboardHelpDialog_medianScreen_jumpToStartOfCardsOrNumberLine', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.jumpToStartOfCardsOrNumberLineStringProperty],
  ['keyboardHelpDialog_medianScreen_jumpToEndOfCardsOrNumberLine', CenterAndVariabilityStrings.keyboardHelpDialog.medianScreen.jumpToEndOfCardsOrNumberLineStringProperty],
  ['keyboardHelpDialog_meanAndMedianScreen_movePredictMeanOrMedian', CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictMeanOrMedianStringProperty],
  ['keyboardHelpDialog_meanAndMedianScreen_movePredictionPointer', CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictionPointerStringProperty],
  ['keyboardHelpDialog_meanAndMedianScreen_movePredictMeanInSmallerSteps', CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.movePredictMeanInSmallerStepsStringProperty],
  ['keyboardHelpDialog_meanAndMedianScreen_moveInLargerSteps', CenterAndVariabilityStrings.keyboardHelpDialog.meanAndMedianScreen.moveInLargerStepsStringProperty],
  ['keyboardHelpDialog_variabilityScreen_movePointerIntervalHandleOrIntervalBlock', CenterAndVariabilityStrings.keyboardHelpDialog.variabilityScreen.movePointerIntervalHandleOrIntervalBlockStringProperty],
  ['keyboardHelpDialog_variabilityScreen_object', CenterAndVariabilityStrings.keyboardHelpDialog.variabilityScreen.objectStringProperty],
  ['a11y_medianScreenHelpText', CenterAndVariabilityStrings.a11y.medianScreenHelpTextStringProperty],
  ['a11y_meanAndMedianScreenHelpText', CenterAndVariabilityStrings.a11y.meanAndMedianScreenHelpTextStringProperty],
  ['a11y_variabilityScreenHelpText', CenterAndVariabilityStrings.a11y.variabilityScreenHelpTextStringProperty],
  ['a11y_common_guidingQuestion', CenterAndVariabilityStrings.a11y.common.guidingQuestionStringProperty],
  ['a11y_common_soccerField', CenterAndVariabilityStrings.a11y.common.soccerFieldStringProperty],
  ['a11y_common_interactionHintNoBalls', CenterAndVariabilityStrings.a11y.common.interactionHintNoBallsStringProperty],
  ['a11y_common_eraseButton_accessibleName', CenterAndVariabilityStrings.a11y.common.eraseButton.accessibleNameStringProperty],
  ['a11y_common_eraseButton_accessibleHelpText', CenterAndVariabilityStrings.a11y.common.eraseButton.accessibleHelpTextStringProperty],
  ['a11y_common_medianPredictionSlider_accessibleName', CenterAndVariabilityStrings.a11y.common.medianPredictionSlider.accessibleNameStringProperty],
  ['a11y_common_meanPredictionSlider_accessibleName', CenterAndVariabilityStrings.a11y.common.meanPredictionSlider.accessibleNameStringProperty],
  ['a11y_common_medianCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.common.medianCheckbox.accessibleNameStringProperty],
  ['a11y_common_medianCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.common.medianCheckbox.accessibleHelpTextStringProperty],
  ['a11y_common_meanCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.common.meanCheckbox.accessibleNameStringProperty],
  ['a11y_common_meanCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.common.meanCheckbox.accessibleHelpTextStringProperty],
  ['a11y_common_predictMedianCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.common.predictMedianCheckbox.accessibleNameStringProperty],
  ['a11y_common_predictMedianCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.common.predictMedianCheckbox.accessibleHelpTextStringProperty],
  ['a11y_common_predictMeanCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.common.predictMeanCheckbox.accessibleNameStringProperty],
  ['a11y_common_predictMeanCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.common.predictMeanCheckbox.accessibleHelpTextStringProperty],
  ['a11y_median_playArea', CenterAndVariabilityStrings.a11y.median.playAreaStringProperty],
  ['a11y_median_controlArea', CenterAndVariabilityStrings.a11y.median.controlAreaStringProperty],
  ['a11y_median_currentDetails', CenterAndVariabilityStrings.a11y.median.currentDetailsStringProperty],
  ['a11y_median_interactionHintSomeBalls', CenterAndVariabilityStrings.a11y.median.interactionHintSomeBallsStringProperty],
  ['a11y_median_distanceAccordionBox_accessibleName', CenterAndVariabilityStrings.a11y.median.distanceAccordionBox.accessibleNameStringProperty],
  ['a11y_median_dataCardsGroup_noCardsAccessibleName', CenterAndVariabilityStrings.a11y.median.dataCardsGroup.noCardsAccessibleNameStringProperty],
  ['a11y_median_dataCardsGroup_selectAccessibleName', CenterAndVariabilityStrings.a11y.median.dataCardsGroup.selectAccessibleNameStringProperty],
  ['a11y_median_dataCardsGroup_sortAccessibleName', CenterAndVariabilityStrings.a11y.median.dataCardsGroup.sortAccessibleNameStringProperty],
  ['a11y_median_dataCardsGroup_selectAccessibleHelpText', CenterAndVariabilityStrings.a11y.median.dataCardsGroup.selectAccessibleHelpTextStringProperty],
  ['a11y_median_dataCardsGroup_sortAccessibleHelpText', CenterAndVariabilityStrings.a11y.median.dataCardsGroup.sortAccessibleHelpTextStringProperty],
  ['a11y_median_sortDataCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.median.sortDataCheckbox.accessibleNameStringProperty],
  ['a11y_median_sortDataCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.median.sortDataCheckbox.accessibleHelpTextStringProperty],
  ['a11y_median_cardsMedianCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.median.cardsMedianCheckbox.accessibleNameStringProperty],
  ['a11y_median_cardsMedianCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.median.cardsMedianCheckbox.accessibleHelpTextStringProperty],
  ['a11y_median_details_accessibleName', CenterAndVariabilityStrings.a11y.median.details.accessibleNameStringProperty],
  ['a11y_meanAndMedian_playArea', CenterAndVariabilityStrings.a11y.meanAndMedian.playAreaStringProperty],
  ['a11y_meanAndMedian_controlArea', CenterAndVariabilityStrings.a11y.meanAndMedian.controlAreaStringProperty],
  ['a11y_meanAndMedian_accordionBoxHelpText', CenterAndVariabilityStrings.a11y.meanAndMedian.accordionBoxHelpTextStringProperty],
  ['a11y_meanAndMedian_plotMedianCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.meanAndMedian.plotMedianCheckbox.accessibleNameStringProperty],
  ['a11y_meanAndMedian_plotMedianCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.meanAndMedian.plotMedianCheckbox.accessibleHelpTextStringProperty],
  ['a11y_meanAndMedian_plotMeanCheckbox_accessibleName', CenterAndVariabilityStrings.a11y.meanAndMedian.plotMeanCheckbox.accessibleNameStringProperty],
  ['a11y_meanAndMedian_plotMeanCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.meanAndMedian.plotMeanCheckbox.accessibleHelpTextStringProperty],
  ['a11y_meanAndMedian_details_accessibleName', CenterAndVariabilityStrings.a11y.meanAndMedian.details.accessibleNameStringProperty],
  ['a11y_variability_playArea', CenterAndVariabilityStrings.a11y.variability.playAreaStringProperty],
  ['a11y_variability_controlArea', CenterAndVariabilityStrings.a11y.variability.controlAreaStringProperty],
  ['a11y_variability_sceneRadioButtonGroup_groupName', CenterAndVariabilityStrings.a11y.variability.sceneRadioButtonGroup.groupNameStringProperty],
  ['a11y_variability_sceneRadioButtonGroup_scene1AccessibleName', CenterAndVariabilityStrings.a11y.variability.sceneRadioButtonGroup.scene1AccessibleNameStringProperty],
  ['a11y_variability_sceneRadioButtonGroup_scene2AccessibleName', CenterAndVariabilityStrings.a11y.variability.sceneRadioButtonGroup.scene2AccessibleNameStringProperty],
  ['a11y_variability_sceneRadioButtonGroup_scene3AccessibleName', CenterAndVariabilityStrings.a11y.variability.sceneRadioButtonGroup.scene3AccessibleNameStringProperty],
  ['a11y_variability_sceneRadioButtonGroup_scene4AccessibleName', CenterAndVariabilityStrings.a11y.variability.sceneRadioButtonGroup.scene4AccessibleNameStringProperty],
  ['a11y_variability_sceneRadioButtonGroup_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.sceneRadioButtonGroup.accessibleHelpTextStringProperty],
  ['a11y_variability_pointerCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.pointerCheckbox.accessibleHelpTextStringProperty],
  ['a11y_variability_predictionPointer_accessibleName', CenterAndVariabilityStrings.a11y.variability.predictionPointer.accessibleNameStringProperty],
  ['a11y_variability_measuresRadioButtonGroup_groupName', CenterAndVariabilityStrings.a11y.variability.measuresRadioButtonGroup.groupNameStringProperty],
  ['a11y_variability_measuresRadioButtonGroup_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.measuresRadioButtonGroup.accessibleHelpTextStringProperty],
  ['a11y_variability_measureAccordionBox_rangeAccessibleHelpText', CenterAndVariabilityStrings.a11y.variability.measureAccordionBox.rangeAccessibleHelpTextStringProperty],
  ['a11y_variability_measureAccordionBox_iqrAccessibleHelpText', CenterAndVariabilityStrings.a11y.variability.measureAccordionBox.iqrAccessibleHelpTextStringProperty],
  ['a11y_variability_measureAccordionBox_madAccessibleHelpText', CenterAndVariabilityStrings.a11y.variability.measureAccordionBox.madAccessibleHelpTextStringProperty],
  ['a11y_variability_rangeCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.rangeCheckbox.accessibleHelpTextStringProperty],
  ['a11y_variability_iqrCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.iqrCheckbox.accessibleHelpTextStringProperty],
  ['a11y_variability_madCheckbox_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.madCheckbox.accessibleHelpTextStringProperty],
  ['a11y_variability_details_accessibleNamePattern', CenterAndVariabilityStrings.a11y.variability.details.accessibleNamePatternStringProperty],
  ['a11y_variability_intervalTool_heading', CenterAndVariabilityStrings.a11y.variability.intervalTool.headingStringProperty],
  ['a11y_variability_intervalTool_accessibleHelpText', CenterAndVariabilityStrings.a11y.variability.intervalTool.accessibleHelpTextStringProperty],
  ['a11y_variability_intervalTool_handle1AccessibleName', CenterAndVariabilityStrings.a11y.variability.intervalTool.handle1AccessibleNameStringProperty],
  ['a11y_variability_intervalTool_handle2AccessibleName', CenterAndVariabilityStrings.a11y.variability.intervalTool.handle2AccessibleNameStringProperty],
  ['a11y_variability_intervalTool_rectangleAccessibleName', CenterAndVariabilityStrings.a11y.variability.intervalTool.rectangleAccessibleNameStringProperty],
  ['a11y_variability_intervalTool_rectangleValuePattern', CenterAndVariabilityStrings.a11y.variability.intervalTool.rectangleValuePatternStringProperty],
  ['a11y_preferences_plotType_accessibleHelpText', CenterAndVariabilityStrings.a11y.preferences.plotType.accessibleHelpTextStringProperty]
] );

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
  kickValuePatternStringProperty: CenterAndVariabilityStrings.kickValuePatternStringProperty,
  distanceInMetersAccordionBoxTitleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersAccordionBoxTitle' ),
  distanceInMetersChartLabelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'distanceInMetersChartLabel' ),
  meanEqualsValueMetersPatternStringProperty: CenterAndVariabilityStrings.meanEqualsValueMetersPatternStringProperty,
  meanEqualsValueMPatternStringProperty: CenterAndVariabilityStrings.meanEqualsValueMPatternStringProperty,
  meanEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanEqualsUnknown' ),
  medianEqualsValuePatternStringProperty: CenterAndVariabilityStrings.medianEqualsValuePatternStringProperty,
  medianEqualsValueMPatternStringProperty: CenterAndVariabilityStrings.medianEqualsValueMPatternStringProperty,
  medianEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianEqualsUnknown' ),
  medianEqualsValueUnitsPatternStringProperty: CenterAndVariabilityStrings.medianEqualsValueUnitsPatternStringProperty,
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
  valueKicksPatternStringProperty: CenterAndVariabilityStrings.valueKicksPatternStringProperty,
  pointerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'pointer' ),
  medianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianQuestion' ),
  sortDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'sortData' ),
  youSortedTheDataStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'youSortedTheData' ),
  medianDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'medianDescription' ),
  meanAndMedianQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanAndMedianQuestion' ),
  meanDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'meanDescription' ),
  variabilityQuestionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'variabilityQuestion' ),
  iqrEqualsValueMPatternStringProperty: CenterAndVariabilityStrings.iqrEqualsValueMPatternStringProperty,
  iqrEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'iqrEqualsUnknown' ),
  rangeEqualsValueMPatternStringProperty: CenterAndVariabilityStrings.rangeEqualsValueMPatternStringProperty,
  rangeEqualsUnknownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rangeEqualsUnknown' ),
  madEqualsValueMPatternStringProperty: CenterAndVariabilityStrings.madEqualsValueMPatternStringProperty,
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
  iqrEqualsQ3MinusQ3PatternStringProperty: CenterAndVariabilityStrings.iqrEqualsQ3MinusQ3PatternStringProperty,
  iqrEqualsIQRUnitsPatternStringProperty: CenterAndVariabilityStrings.iqrEqualsIQRUnitsPatternStringProperty,
  madDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'madDescription' ),
  madEqualsMADMetersPatternStringProperty: CenterAndVariabilityStrings.madEqualsMADMetersPatternStringProperty,
  rangeEqualsMaxMinusMinPatternStringProperty: CenterAndVariabilityStrings.rangeEqualsMaxMinusMinPatternStringProperty,
  rangeEqualsRangeUnitsPatternStringProperty: CenterAndVariabilityStrings.rangeEqualsRangeUnitsPatternStringProperty,
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
      currentDetails: new FluentPattern<{ distances: FluentVariable, number: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_median_currentDetails' ),
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
      }
    },
    variability: {
      playArea: new FluentPattern<{ maxBalls: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_variability_playArea' ),
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
      }
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
