# Center and Variability - Implementation Notes

## Table of Contents

* [Introduction](#introduction)
* [General Considerations](#general-considerations)
    * [Model-View Transforms](#model-view-transforms)
    * [Query Parameters](#query-parameters)
    * [Memory Management](#memory-management)
* [Scenes](#scenes)
* [Sound](#sound)
* [Alternative Input](#alternative-input)
* [PhET-iO](#phet-io)

## Introduction

This document contains notes related to the implementation of _Center and Variability_.
This is not an exhaustive description of the implementation. The intention is
to provide a concise high-level overview, and to supplement the internal documentation
(source code comments) and external documentation (design documents).

Before reading this document, please read:

* [model.md](https://github.com/phetsims/center-and-variability/blob/main/doc/model.md), a high-level description of the
  simulation model

In addition to this document, you are encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
* [Center and Variability HTML5 design document](https://docs.google.com/document/d/19OG6qtThtkH89zCQmkIckM6ZKV8W1zkCT0ZghXKcL9U/edit#) (
  definitely incomplete and out of date, but worth a look)

## General Considerations

### Scenes

### Model-View Transforms

This simulation makes use of 2 model-view transforms to map model coordinates (horizontally: meters, vertically: number
of data points) to view coordinates.

### Query Parameters

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented
in `CAVQueryParameters.ts`.

### Memory Management

* **Dynamic allocation:** All objects in this sim are allocated at startup, and exist for the lifetime of the
  simulation. We use `isActiveProperty` flags or other phase Property flags to indicate whether they appear in the sim
  and participate in the model.

* **Listeners**: All uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink`, `removeListener`, etc.

* **dispose**: All classes have a `dispose` method, possibly inherited from a super class. Sim-specific classes whose
  instances exist for the lifetime of the sim are not intended to be disposed. They are created
  with `isDisposable: false`, or have a `dispose` method that looks like this:

```ts
public
dispose()
:
void {
  Disposable.assertNotDisposable();
}
```

## Measures of Center

## Measures of Spread

## Plot Nodes

### Main Architecture

Each CAVModel has 1 or more CAVSceneModel. The scene defines the soccer ball data and the soccer players. Other settings
such
as whether checkboxes are selected are stored in the CAVModel. There is a similar pattern for the views.

The simulation depends on soccer-common, so that the soccer context can be reused in other sims (including Mean Share
and Balance)

### The Variability Measurements (range, mad, iqr)

The Variability Measurements (range, mad, iqr) have subtle variations when shown in the accordion box
vs in the info dialog, so that is managed with a context option.

### Miscellaneous Notes

* This sim uses ToggleNode in many places to switch between scenes and variability measures.

See also soccer-common/implementation-notes.md

## Sound

All sounds are provided by common-code UI components. There are currently no sounds associated with sim-specific UI
components and interactions.

## Alternative Input

To identify focus traversal order, search for `pdomOrder`.

To identify sim-specific support for keyboard input, search for `tagName`. These classes have custom input listeners
that handle keyboard events (e.g. `KeyboardDragListener`).

To identify hotkeys, search for `addHotkey`.

Setting focus for tools is done via tab traversal. This sim does not use `GrabDragInteraction` since at the time of
writing
that did not support the "group" interaction design.

## PhET-iO

The PhET-iO instrumentation of this sim is relatively straightforward. As described
in [Memory Management](#memory-management), everything in this sim is created at startup, and exists for the lifetime of
the sim. So there is no sim-specific use of PhetioGroup or PhetioCapsule. See examples.md for examples of how to
use the PhET-iO API.