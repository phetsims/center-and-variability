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
distribution of distances. On the "Median" and "Mean & Median" screens, the kicker changes after each kick, creating a
distribution
of kicks by different players. On the "Variability" screen, the student can choose between four kickers, creating the opportunity to
compare distributions of kicks per player.

Customizing distributions of kicked soccer balls: The simulation allows students to change the kicked distance of a landed soccer
ball by dragging the soccer ball to a new location.

Sorting data with cards: On the Median screen, students are encouraged to manually sort the cards in the Accordion Box into numerical 
order. Checking the Sort Data checkbox auto-sorts existing cards and any new cards created when additional soccer balls are kicked.

Analyzing data with plots: On the "Mean & Median" and "Variability" screens, an abstract representation of the soccer ball data is 
plotted using an 'x' or a '●' as the data point. The mean, median, and measures of variability can be visually displayed on 
the abstract representation to help students find meaning in these measures.

Overall, the Center and Variability simulation provides a powerful tool for students as they explore, visualize, 
and compare measures of center and spread.
Students gain a deeper understanding of mean and median, how they compare, and learn ways in which 
distributions can be created, described, analyzed, and used to draw conclusions about distributions based on 
the center and spread.

## Common Controls

* The simulation comprises a field in which soccer balls can be kicked or moved, and an Accordion Box in which an
  abstract representation of the soccer ball data is displayed for student analysis.
* Measures of center and variability are explained in the info dialogs, shown by clicking the button in the top-right corner
  of each accordion box.
* A soccer ball is considered a data point that has a null value until it lands, at which point the ball takes the numerical
  value of its location on the number line.
* Values that do not have enough data to compute are depicted with "?"

### Measures of Center

* The mean is computed as the sum of the data points divided by the number of data points.
* The median is the value of the middle data point when the data is sorted. If there are an even number of data points, the
  median is the average of the two middle data values.

### Measures of Spread

* Range: the maximum data value minus the minimum data value. At least one data point is needed to compute the range.
* IQR (interquartile range): the range of the middle 50% of the data. The IQR is computed by taking the difference between 
  the 1st and 3rd quartile values. At least 5 data points are needed to construct the boxplot and calculate the IQR.
* The MAD (mean absolute deviation): the average of the absolute values of all deviations. This is calculated by finding 
  the distance between the mean and each data point, then finding the mean of these distances. 
  Note that the absolute deviations from the mean are rounded to the nearest 0.1. This means the final MAD value may differ
  slightly from the actual (non-rounded) MAD. At least one data point is needed to compute the MAD.

### Kick Distribution Strategies

* Random Skew: The kick distributions are randomly chosen to be skewed left or right. The skew is randomly chosen on startup and on reset-all (
  but not upon clearing the field with the eraser button).
* Random: The kicks are randomly distributed.
