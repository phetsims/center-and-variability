See soccer-common/doc/model.md.

* Soccer Balls have a null value until they land, at which time they take a numerical value.
* Values that do not have enough data to compute are depicted with "?"
* Statistical Measures and Variability Measure definitions and calculations are shown in the "info" dialogs throughout the sim.

### Statistical Measures
* The mean is computed as the sum of the data points divided by the number of data points.
* The median is the middle data point when the data points are sorted. If there is an even number of data points, the median is the average of the two middle data points.

### Variability Measures
* Range: the maximum data point minus the minimum data point. Needs at least one data point to compute.
* IQR (interquartile): the range of the middle 50% of the data. We compute the 1st and 3rd quartile, and find the difference.
To compute the IQR, there must be at least 5 data points.
* The MAD (mean absolute deviation) is the median of the absolute value of the difference between each data point and the median.
Note that the deviations from the mean are rounded to the nearest 0.1 in order to demonstrate the calculation--however,
this means the final result may differ slightly from the actual MAD. Needs at least one data point to compute.

### Kick Distribution Strategies
* Random Skew: The kicks are randomly skewed to the left or right. The skew is randomly chosen on startup and on reset (but not on clear).
* Random: The kicks are randomly distributed.