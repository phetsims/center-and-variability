# Center and Variability - Implementation Notes

## Table of Contents

- [Introduction](#introduction)
- [General Considerations](#general-considerations)
  - [Model-View Transforms](#model-view-transforms)
  - [Query Parameters](#query-parameters)
  - [Memory Management](#memory-management)
  - [Measures of Center & Spread](#measures-of-center--spread)
    - [Workarounds for Abundant and Inconsistent Intermediate Values in Axon Callbacks](#workarounds-for-abundant-and-inconsistent-intermediate-values-in-axon-callbacks)
- [Main Architecture & Scenes](#main-architecture--scenes)
- [The Variability Measurements (range, MAD, IQR)](#the-variability-measurements-range-mad-iqr)
- [Sound](#sound)
- [Alternative Input](#alternative-input)
- [PhET-iO](#phet-io)

## Introduction

This document contains notes related to the implementation of _Center and Variability_. This is not an exhaustive
description of the implementation. The intention is to provide a concise high-level overview, and to supplement the
internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

- [model.md](https://github.com/phetsims/center-and-variability/blob/main/doc/model.md), a high-level description of the
  simulation model

In addition to this document, you are encouraged to read:

- [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
- [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
- [Center and Variability HTML5 design document](https://docs.google.com/document/d/19OG6qtThtkH89zCQmkIckM6ZKV8W1zkCT0ZghXKcL9U/edit#) (
  definitely incomplete and out of date, but worth a look)

## General Considerations

### Model-View Transforms

This simulation makes use of a model-view transform to map model coordinates (horizontally: meters, vertically: number
of data points) to view coordinates in the soccer
area [CAVScreenView.ts](https://github.com/phetsims/center-and-variability/blob/main/js/common/view/CAVScreenView.ts),
and in the charts which are shown in the accordion box and info dialogs. The plotNode model-view
transform (`PLOT_NODE_TRANSFORM`) can be found in [CAVConstants.ts](../js/common/CAVConstants.ts).

### Query Parameters

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented
in [CAVQueryParameters.ts](https://github.com/phetsims/center-and-variability/blob/main/js/common/CAVQueryParameters.ts).

### Memory Management

- **Dynamic allocation:** All objects in this sim are allocated at startup, and exist for the lifetime of the
  simulation. We use `isActiveProperty` flags or other phase Property flags to indicate whether they appear in the sim
  and participate in the model.
- **Listeners**: All uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink`, `removeListener`, etc.
- **dispose**: A lint rule prevents the usage of the term dispose in this repo, and classes are marked
  as `isDisposable: false`. Disposal is not supported and should not be used.

## Measures of Center & Spread

The mathematical definitions of the statistical measures of center and spread are identified in [model.md](./model.md).

### Workarounds for Abundant and Inconsistent Intermediate Values in Axon Callbacks

In order to avoid performance problems and spurious intermediate values in the Variability screen, measures are computed
as a batch, then signified via `updateDataMeasures` and `variabilityDataMeasuresUpdatedEmitter`.
Likewise, `deltaStableProperty`
in [IntervalToolModel.ts](https://github.com/phetsims/center-and-variability/blob/main/js/variability/model/IntervalToolModel.ts)
works around inconsistent intermediate values.

## Main Architecture & Scenes

- Each CAVModel has 1 or more CAVSceneModel. The scene defines the soccer ball data and the soccer players. Other
  settings such as whether checkboxes are selected are stored in the CAVModel. There is a similar pattern for the views.
- The simulation depends on soccer-common, so that the soccer context can be reused in other sims (including _Mean Share
  and Balance_).
- This sim uses ToggleNode in many places to switch between scenes and variability measures.
- The code that renders the representations (charts/cards) in the accordion box also renders the charts in the info
  dialogs.

## The Variability Measurements (range, MAD, IQR)

The Variability Measurements (range, MAD, IQR) have subtle variations when shown in the accordion box vs the info
dialog. This is managed with a `representationContext` option.

## Sound

Each position on the number line is associated with a sound, see [NumberTone.ts](../js/common/model/NumberTone.ts).
There are variations based on whether the user is focusing on values, means, or medians.

On the Median screen, the cards play sounds based on movement. The median animation in the accordion box plays a sound
while animating, see [MedianAnimationTone.ts](../js/median/view/MedianAnimationTone.ts).

The interval tool generates a continuous sound while the user is dragging the interval or its handles. This continuous
sound represents the width, or interval the tool is currently set to.

Other sounds are provided by common-code UI components.

## Alternative Input

To identify focus traversal order, search for `pdomOrder`.

To identify sim-specific support for keyboard input, search for `tagName`. These classes have custom input listeners
that handle keyboard events (e.g. `KeyboardDragListener`).

This simulation does not use hotkeys.

Setting focus for tools is done via tab traversal. This sim does not use `GrabDragInteraction` since at the time of
writing that did not support the "group" interaction design.

This sim uses "group" interaction for the cards and for the soccer balls, where the user first selects an object via the
arrow keys, then presses enter/spacebar to grab the object.

1-D draggable items that are not in a group, such as the prediction arrows and interval tool handles, are implemented
as `AccessibleSlider`.

## PhET-iO

The PhET-iO instrumentation of this sim is relatively straightforward. As described
in [Memory Management](#memory-management), everything in this sim is created at startup, and exists for the lifetime of
the sim. So there is no sim-specific use of PhetioGroup or PhetioCapsule. See examples.md for examples of how to use the
PhET-iO API.

See
also [soccer-common/implementation-notes.md](https://github.com/phetsims/soccer-common/blob/main/doc/implementation-notes.md).
