let xRangeMin = 0, xRangeMax = 6, yRangeMin = 0, yRangeMax = 1.1;
let xFitStart = 3.5, xFitEnd = 4;
let yFit, yEndFit;
let labels, values;


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('xmin').value = xRangeMin;
    document.getElementById('ymin').value = yRangeMin;
    document.getElementById('xmax').value = xRangeMax;
    document.getElementById('ymax').value = yRangeMax;

    document.getElementById('x0').value = xFitStart;
    document.getElementById('x1').value = xFitEnd;

    plotLineChart();
});


function updateRanges() {
    xRangeMin = parseFloat(document.getElementById('xmin').value);
    xRangeMax = parseFloat(document.getElementById('xmax').value);
    yRangeMin = parseFloat(document.getElementById('ymin').value);
    yRangeMax = parseFloat(document.getElementById('ymax').value);

    xFitStart = parseFloat(document.getElementById('x0').value);
    xFitEnd = parseFloat(document.getElementById('x1').value);

    plotLineChart();
}


function calculateLinearRegression(x1, y1, x2, y2) {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return { m, b };
}


function calculateFittingData(xStart, xEnd) {
    const fittingData = {};

    fittingData.yFitStart = interpolateY(xFitStart);
    fittingData.yFitEnd = interpolateY(xFitEnd);

    // If exact values for xFitStart or xFitEnd are not found, use the next available values
    if (fittingData.yFitStart === undefined) {
        const nextIndex = labels.findIndex(label => label > xFitStart);
        fittingData.yFitStart = values[nextIndex];
    }

    if (fittingData.yFitEnd === undefined) {
        const nextIndex = labels.findIndex(label => label > xFitEnd);
        fittingData.yFitEnd = values[nextIndex];
    }

    fittingData.yFit = interpolateY(xStart);
    fittingData.yEndFit = interpolateY(xEnd);

    // Additional check for undefined values
    if (fittingData.yFit === undefined || fittingData.yEndFit === undefined) {
        console.error("Error: Invalid values for yFit or yEndFit.");
        return {};
    }

    const regressionResult = calculateLinearRegression(xStart, fittingData.yFit, xEnd, fittingData.yEndFit);
    fittingData.m = regressionResult.m;
    fittingData.b = regressionResult.b;

    // Calculate x-intercept value
    fittingData.xIntercept = -fittingData.b / fittingData.m;

    console.log("Calculated m, b, and x-intercept:", regressionResult);

    return fittingData;
}


function interpolateY(x) {
    const inputData = document.getElementById('message').value.trim();
    const rows = inputData.split('\n');
    const sortedRows = rows.sort((a, b) => parseFloat(a.split(',')[0]) - parseFloat(b.split(',')[0]));

    labels = sortedRows.map(row => parseFloat(row.split(',')[0]));
    values = sortedRows.map(row => parseFloat(row.split(',')[1]));

    const index = labels.findIndex(label => label >= x);

    if (index === 0) {
        return values[0];
    } else if (index === -1 || index === labels.length - 1) {
        return values[values.length - 1];
    } else {
        const x0 = labels[index - 1];
        const x1 = labels[index];
        const y0 = values[index - 1];
        const y1 = values[index];

        return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
}


function plotLineChart() {
    const inputData = document.getElementById('message').value.trim();
    const rows = inputData.split('\n');
    const columns = rows.map(row => row.split(','));

    labels = columns.map(column => parseFloat(column[0]));
    values = columns.map(column => parseFloat(column[1]));

    const fittingData = calculateFittingData(xFitStart, xFitEnd);

    yFit = fittingData.yFit;
    yEndFit = fittingData.yEndFit;

    const fittingLine = {
        x: [xFitStart, xFitEnd],
        y: [yFit, yEndFit],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'red' }
    };

    const originalData = {
        x: labels,
        y: values,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: 'rgb(75, 192, 192)' }
    };

    const layout = {
        title: {
            text: `X-intercept: ${fittingData.xIntercept.toFixed(2)}; y = ${fittingData.m.toFixed(2)}x + ${fittingData.b.toFixed(2)}`,
            x: 0.5,
            y: 0.9,
            xanchor: 'center',
            yanchor: 'top',
            font: { size: 16, color: 'black' }
        },
        xaxis: {
            range: [xRangeMin, xRangeMax],
            tickmode: 'linear',
            tick0: xRangeMin,
            dtick: (xRangeMax - xRangeMin) / 4
        },
        yaxis: {
            range: [yRangeMin, yRangeMax],
            tickmode: 'linear',
            tick0: yRangeMin,
            dtick: (yRangeMax - yRangeMin) / 5
        },
    };

    var config = {responsive: true,
        editable: true,

        toImageButtonOptions: {
            format: 'svg',
            filename: 'UV-bandgap',
            scale: 1.5
          },

        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",

    };
    

    Plotly.newPlot('plotlyChart', [originalData, fittingLine], layout, config);

    displayFunctionExpression(fittingData.m, fittingData.b);
}



function displayFunctionExpression(m, b) {
    if (m === undefined || b === undefined) {
        console.error("Error: Invalid values for m or b.");
        return;
    }

    const functionExpression = `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`;
    const xIntercept = `X-intercept: ${(-b / m).toFixed(2)}`;
    
    // Calculate x-intercept value
    const xInterceptValue = -b / m;

    // 출력
    console.log("Function Expression:", functionExpression);
    console.log("X-intercept:", xIntercept);

}


document.getElementById('xmin').addEventListener('input', updateRanges);
document.getElementById('ymin').addEventListener('input', updateRanges);
document.getElementById('xmax').addEventListener('input', updateRanges);
document.getElementById('ymax').addEventListener('input', updateRanges);
document.getElementById('x0').addEventListener('input', updateRanges);
document.getElementById('x1').addEventListener('input', updateRanges);
