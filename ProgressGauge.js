/*
HTML syntax:
	<canvas class="ProgressGauge" data-percentage="55" data-color="rgb(20, 52, 164)"  width="100" height="100"></canvas>
	<script src="ProgressGauge.js"></script>
*/

//Calculates next x,y coordinate in circle path
function GetNextCirclePoint(circleObj) {
	circleObj.degree -= 2;
	let xSet = Math.cos(circleObj.degree * Math.PI / 180) * circleObj.radius;
	let ySet = Math.sin(circleObj.degree * Math.PI / 180) * circleObj.radius;
	circleObj.x = circleObj.centerX - xSet;
	circleObj.y = circleObj.centerY - ySet;
}

//Gets the percentage value from a fraction
function getPercentage(fraction) {
	let separator = fraction.search("/");
	let numerator = Number(fraction.substring(0, separator));
	let denominator = Number(fraction.substring(separator + 1));
	return Math.round((numerator / denominator) * 100);
}

//Loop through all canvases with class='ProgressGauge'
let canvasElements = document.getElementsByClassName("ProgressGauge");
for (let i = 0; i < canvasElements.length; ++i) {

	let c = canvasElements[i];
	let ctx = c.getContext("2d");
	let canvasWidth = c.width;
	let canvasHeight = c.height;

	//Error if canvas is not square.
	if (canvasWidth != canvasHeight) {
		console.error('Error: Canvas for ProgressGauge must have an equal width and height');
		continue;
	}

	//Error if canvas does not have percentage defined
	let fraction;
	let percentage;
	let is_percentage;
	if (c.hasAttribute('data-percentage')) {
		if (c.dataset.percentage.search("/") === -1) {
			is_percentage = true;
			percentage = c.dataset.percentage;
		}
		else {
			is_percentage = false;
			//Generate the percentage from the fraction
			fraction = c.dataset.percentage;
			percentage = getPercentage(fraction);
		}

		if (percentage < 0 || percentage > 100) {
			console.error('Error: \'data-percentage\' attribute for ProgressGauge must be between 0 and 100.');
			continue;
		}
	}
	else {
		console.error('Error: Canvas for ProgressGauge must have \'data-percentage\' attribute.');
		continue;
	}

	//Get the canvas data.
	let ringWidth = canvasWidth * .025;
	let color;
	if (c.hasAttribute('data-color') === true) {
		color = c.dataset.color;
	}
	else {
		color = 'rgb(0,46,93)';
	}

	//Create the dark circle.
	let darkCircle = {
		x: canvasWidth / 2,
		y: canvasHeight * 0.1,
		degree: 90,
		centerX: canvasWidth / 2,
		centerY: canvasHeight / 2,
		radius: (canvasHeight / 2) - (canvasHeight * 0.1)
	};

	//Create the light circle.
	let lightCircle = {
		x: canvasWidth / 2,
		y: canvasHeight * 0.1,
		degree: 90,
		centerX: canvasWidth / 2,
		centerY: canvasHeight / 2,
		radius: (canvasHeight / 2) - (canvasHeight * 0.1)
	};

	//Write the percentages as text at the center of each canvas.
	ctx.fillStyle = color;
	ctx.font = `${canvasWidth * 0.25}px serif`;
	let percentText;
	if (is_percentage) {
		percentText = `${percentage}%`;
	}
	else {
		percentText = `${fraction}`;
	}
	let textWidth = ctx.measureText(percentText).width;
	ctx.fillText(percentText, (canvasWidth / 2) - (textWidth / 2), (canvasHeight / 2) + canvasHeight * 0.07);

	//Function called for every animation frame.
	function step(timestamp) {
		if (start === undefined) {
			start = timestamp;
		}
		//Calculate total time elapsed.
		const elapsed = timestamp - start;

		//Time has passed.
		if (previousTimeStamp !== timestamp) {
			//Draw the next dark circle until it has wrapped all the way around.
			if (darkCircle.degree > -270) {
				GetNextCirclePoint(darkCircle);
				ctx.fillStyle = '#D3D3D3';
				ctx.beginPath();
				ctx.arc(darkCircle.x, darkCircle.y, ringWidth, 0, 2*Math.PI);
				ctx.fill();
			}
			//Draw the next light circle if the dark circle has already traveled 15 degrees and the degree has not reached the degree that equals the percentage
			if (darkCircle.degree < 75 && lightCircle.degree > 90 - (percentage / 100 * 360)) {
				GetNextCirclePoint(lightCircle);
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(lightCircle.x, lightCircle.y, ringWidth, 0, 2*Math.PI);
				ctx.fill();
			}
			//If dark and light circles have reached their final points, set done = true.
			if (darkCircle.degree <= -270 && lightCircle.degree <= 90 - (percentage / 100 * 360)) {
				done = true;
			}
		}

		//Max time allowed is 5 seconds.
		if (elapsed <= 5000 && done === false) {
			window.requestAnimationFrame(step);
		}
	}

	//Begin the animations.
	let start, previousTimeStamp;
	let done = false;
	window.requestAnimationFrame(step);
}
