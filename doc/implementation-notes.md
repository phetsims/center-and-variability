### Main Architecture

Each CAVModel has 1 or more CAVSceneModel. The scene defines the soccer ball data and the soccer players. Other settings such
as whether checkboxes are selected are stored in the CAVModel.  There is a similar pattern for the views.

The simulation depends on soccer-common, so that the soccer context can be reused in other sims (including Mean Share and Balance)

### PhET-iO

Everything is statically allocated and we use `isActiveProperty` flags or other enumeration states to indicate whether an object is active or in the pool.

### The Variability Measurements (range, mad, iqr)

The Variability Measurements (range, mad, iqr) have subtle variations when shown in the accordion box
vs in the info dialog, so that is managed with a context option.

### Miscellaneous Notes

* This sim uses ToggleNode in many places to switch between scenes and variability measures.

See also soccer-common/implementation-notes.md