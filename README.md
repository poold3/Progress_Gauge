# Progress_Gauge
JavaScript for animated, custom-sized, and custom-colored progress gauges. Perfect for dashboards.
https://codepen.io/poold3/pen/vYRMbyp
## HTML Syntax
```
<canvas class="ProgressGauge" data-percentage="55" data-color="rgb(20, 52, 164)"  width="100" height="100"></canvas>
<script src="ProgressGauge.js"></script>
```
## Notes
The animation consists of the circles moving around the percentage number.
The `data-percentage` element is required and can be a percentage or a fraction. The fractional value must be between 0 and 1. The percentage value must be between 0 and 100. The following examples will produce the same progress gauge.
Fraction Example: `data-percentage="1/5"`
Percentage Example: `data-percentage="20"`
The `data-color` element is not required. If not provided, the default color is rgb(0,46,93).
The code allows for any size of canvas, as long as it is square.
## Example
![Example](/Examples.JPG)
