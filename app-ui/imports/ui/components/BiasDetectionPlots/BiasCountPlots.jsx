import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './BiasPlots.css'


const labelWrapper = (value) => {
    let wrappedArray = []
    for (let i = 0; i < value.length; i++) {
        if (typeof (value[i]) === typeof ("string") && value.length > 9) {
            wrappedArray.push(value[i].split(" "));

        }
        else {
            wrappedArray.push(value[i]);
        }
    }
    return wrappedArray;
};

// only active function for mouse move
function handleMouseMove(chart, mousemove, cov_thres) {
    chart.update('none');

    const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;

    let xVal = x.getValueForPixel(mousemove.offsetX);
    let yVal = y.getValueForPixel(mousemove.offsetY);

    const fontHeight = 0.25 * height;
    ctx.font = `bolder ${fontHeight / 2}px Roboto`;

    if (yVal > cov_thres) {
        chart.update('none');
        ctx.fillStyle = '#449231';
        ctx.fillText('High Coverage', width / 6, y.getPixelForValue(cov_thres) - top)
        ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
        ctx.fillRect(left, top, width, y.getPixelForValue(cov_thres) - top)
        ctx.restore();
    }
    else {
        chart.update('none');
        ctx.fillStyle = '#D64242';
        ctx.fillText('Low Coverage', width / 6, y.getPixelForValue(0) - top)
        ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
        ctx.fillRect(left, y.getPixelForValue(cov_thres), width, y.getPixelForValue(0))
        ctx.restore();
    }

}

// only active function for mouse leave element
function handleMouseOut(chart, event) {
    chart.update('none');
    chart.update();
}

export const BiasCountPlots = ({ y_values, x_values, coverage, rr, cov_thres }) => {
    let bdColor = [];

    for (let i = 0; i < rr.length; i++) {
        if (rr[i] < 50) {
            bdColor.push("#67A3FF");
        }
        else if (rr[i] < 80) {
            bdColor.push("#1363DF");
        }
        else {
            bdColor.push("#244CB1");
        }
    };

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'sample counts',
                data: y_values,
                pointRadius: 0,
                fill: true,
                backgroundColor: bdColor,
                borderColor: bdColor,
                barPercentage: 0.5,
                categoryPercentage: 0.6,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                }
            },
        ],
    };

    const options = {
        animation: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: "#000",
                formatter: function (value, context) {
                    return "RR: " + rr[context.dataIndex] + "%" + "\n" + "Coverage :" + coverage[context.dataIndex];
                },
                textAlign: 'center',
                font: function (context) {
                    var width = context.chart.width;
                    var size = Math.round(width / 40);
                    return {
                        size: size,
                    };
                }
            },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = "Coverage " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    },
                    title: function (context) {
                        let label = "";
                        if (context.label !== null) {
                            label += context[0].label;
                        }
                        return label.replaceAll(",", " ");
                    }
                }
            },
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
            }
        },
        scales: {
            y: {
                display: true,
                beginAtZero: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                min: 0,
                max: Math.max.apply(Math, y_values) * 1.5,
                ticks: {
                    padding: 0,
                    color: "#000000",
                    font: {
                        size: 8
                    }
                },
                title: {
                    display: true,
                    text: 'No. of samples',
                    color: "#000000",
                    font: {
                        size: "12vh"
                    }
                }
            },
            x: {
                display: true,
                offset: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                ticks: {
                    padding: 1,
                    color: "#000000",
                    font: {
                        size: "10vh"
                    }
                },
                text: "Features",
            }
        },
    };



    const onMove = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseMove(chart, event.nativeEvent, cov_thres);
    }
    const onOut = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseOut(
            chart,
            event.nativeEvent);
    }
    // plugin block
    const thresholdLine = {
        id: 'thresholdLine',
        afterDatasetDraw(chart, args, option) {
            const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
            ctx.save();
            let min_acc = Math.min(...y_values.flat());
            if (min_acc < cov_thres) {
                const fontHeight = 0.25 * height;
                ctx.font = `bold ${fontHeight / 2}px Helvetica`;
                ctx.fillStyle = '#D64242';
                ctx.textAlign = 'right';
                //ctx.fillText(`THRESHOLD: ${cov_thres}`, right, y.getPixelForValue(cov_thres) - (0.7 * height))
                //ctx.fillText(`${cov_thres}`, right, y.getPixelForValue(cov_thres) - (0.7 * height))
                // Threshold Line   
                ctx.strokeStyle = "#D64242";
                //ctx.setLineDash([5, 10]);
                ctx.strokeRect(left, y.getPixelForValue(cov_thres), width, 0);
            }
            ctx.restore();
        },
        afterDraw(chart, args, option) {
            const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
            ctx.save();

            const arrowWidth = 3;
            //Arrow heads - top
            ctx.beginPath();
            ctx.moveTo(left, top - 5);
            ctx.lineTo(left - arrowWidth, top);
            ctx.lineTo(left + arrowWidth, top);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            //Arrow heads - right
            ctx.beginPath();
            ctx.moveTo(right, bottom - arrowWidth);
            ctx.lineTo(right, bottom + arrowWidth);
            ctx.lineTo(right + 5, bottom);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }

    data.labels = labelWrapper(x_values);

    data.datasets[0].data = y_values;

    const chartRef = useRef();

    return (
        <>
            <div className="BarPlotContainer">
                <Bar
                    data={data}
                    options={options}
                    //ref={chartRef}
                    redraw={true}
                    //onMouseMove={onMove}
                    //onMouseLeave={onOut}
                    //onMouseOut={onOut}
                    plugins={[ChartDataLabels, thresholdLine]}
                />
            </div>
        </>
    );
};