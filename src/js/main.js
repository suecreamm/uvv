// main.js

let xRangeMin = 0, xRangeMax = 6, yRangeMin = 0, yRangeMax = 1.1;
let xFitStart = 2, xFitEnd = 3;

document.addEventListener('DOMContentLoaded', function () {
    // Set default values for input fields
    document.getElementById('xmin').value = xRangeMin;
    document.getElementById('ymin').value = yRangeMin;
    document.getElementById('xmax').value = xRangeMax;
    document.getElementById('ymax').value = yRangeMax;

    document.getElementById('x0').value = xFitStart;
    document.getElementById('x1').value = xFitEnd;
});

function updateRanges() {
    xRangeMin = parseFloat(document.getElementById('xmin').value);
    xRangeMax = parseFloat(document.getElementById('xmax').value);
    yRangeMin = parseFloat(document.getElementById('ymin').value);
    yRangeMax = parseFloat(document.getElementById('ymax').value);

    xFitStart = parseFloat(document.getElementById('x0').value);
    xFitEnd = parseFloat(document.getElementById('x1').value);

    // Automatically calculate y-values within the specified x-range for fitting
    const fittingData = calculateFittingData(xFitStart, xFitEnd);

    // Set yFit and yEndFit with the calculated values
    yFit = fittingData.yFit;
    yEndFit = fittingData.yEndFit;
}

function calculateFittingData(xStart, xEnd) {
    // Modify this function based on your actual data or fitting logic
    const yFit = 0.5 * (xStart + xEnd); // Example: Linear fitting
    const yEndFit = 0.5 * (xStart + xEnd);

    return { yFit, yEndFit };
}

function plotLineChart() {
    const inputData = document.getElementById('message').value.trim();

    const rows = inputData.split('\n');
    const columns = rows.map(row => row.split(','));

    const labels = columns.map(column => column[0]);
    const values = columns.map(column => parseFloat(column[1]));

    updateRanges();

    const shapes = [
        {
            type: 'rect',
            x0: xRangeMin,
            x1: xRangeMax,
            y0: yRangeMin,
            y1: yRangeMax,
            fillcolor: 'rgba(0, 0, 0, 0.1)',
            line: { width: 0 }
        }
    ];

    const traces = [
        {
            x: labels,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: 'rgb(75, 192, 192)' }
        },
        {
            x: [xFitStart, xFitEnd],
            y: [yFit, yEndFit],
            type: 'scatter',
            mode: 'lines',
            line: { color: 'red' }
        }
    ];

    Plotly.newPlot('plotlyChart', traces, {
        xaxis: {
            title: 'X축',
            range: [xRangeMin, xRangeMax],
            tickmode: 'linear',
            tick0: xRangeMin,
            dtick: (xRangeMax - xRangeMin) / 4
        },
        yaxis: {
            title: 'Y축',
            range: [yRangeMin, yRangeMax],
            tickmode: 'linear',
            tick0: yRangeMin,
            dtick: (yRangeMax - yRangeMin) / 5
        },
        shapes: shapes
    });

    document.getElementById('plotlyChart').on('plotly_click', function (data) {
        const clickedX = data.points[0].x;
        console.log('Clicked X Coordinate:', clickedX);
    });
}