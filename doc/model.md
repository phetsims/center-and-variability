# Center and Variability - Model Description

@author Sam Reid
<br>@author Marla Schulz
<br>@author Matthew Blackman

This document is a high-level description of the model used in PhET's _Center and Variability_ simulation.

The Center and Variability simulation is designed to help students visualize and understand concepts in statistics,
specifically
relating to mean, median, and measures of spread. The main functionalities of the simulation include:

Creating distributions of kicked soccer balls: The simulation allows students to kick soccer balls onto the field,
creating a
distribution of distances. On the "Median" and "Mean and Median" screens, the kicker changes after each kick, creating a
distribution
of kicks by different players. On the 'Variability' screen, the student can choose between four kickers, creating and
comparing distributions
of repeated kicks by each player.

Adjusting distributions of kicked soccer balls: The simulation allows students to change the position of landed soccer
balls by dragging.

Sorting data with cards: TODO https://github.com/phetsims/center-and-variability/issues/443

Analyzing data with plots: TODO https://github.com/phetsims/center-and-variability/issues/443

Overall, the Center and Variability simulation is a powerful tool for students to explore and visualize concepts in
statistics,
and to gain a deeper understanding of the ways in which distributions can be described, analyzed, and used to draw
conclusions.

## Common Controls

* The simulation comprises a field in which soccer balls can be kicked or moved, and an Accordion Box in which the data
  is displayed with visual representations for student analysis.
* Measures of center and spread are explained in the info dialogs shown by clicking the button in the top-right corner
  of the accordion box.
* Soccer Balls have a null value until they land, at which time they take a numerical value.
* Values that do not have enough data to compute are depicted with "?"

### Measures of Center

* The mean is computed as the sum of the data points divided by the number of data points.
* The median is the middle data point when the data points are sorted. If there is an even number of data points, the
  median is the average of the two middle data points.

### Measures of Spread

* Range: the maximum data point minus the minimum data point. At least one data point is needed to compute the range.
* IQR (interquartile range): the range of the middle 50% of the data. We compute the 1st and 3rd quartile, and find the
  difference.
  To compute the IQR, there must be at least 5 data points.
* The MAD (mean absolute deviation) is the median of the absolute value of the difference between each data point and
  the median.
  Note that the deviations from the mean are rounded to the nearest 0.1 in order to demonstrate the calculation.
  However,
  this means the final result may differ slightly from the actual MAD. At least one data point is needed to compute MAD.

### Kick Distribution Strategies

* Random Skew: The kicks are randomly skewed to the left or right. The skew is randomly chosen on startup and on reset (
  but not on clear).
* Random: The kicks are randomly distributed.
