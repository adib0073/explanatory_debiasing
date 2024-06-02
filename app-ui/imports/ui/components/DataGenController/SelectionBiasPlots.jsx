import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './DataGenController.css'


const labelWrapper = (value) => {
    let wrappedArray = []
    for (let i = 0; i < value.length; i++) {
        wrappedArray.push(value[i].split(" "));
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
        ctx.fillRect(left, y.getPixelForValue(cov_thres), width, height / 2)
        ctx.restore();
    }

}

// only active function for mouse leave element
function handleMouseOut(chart, event) {
    chart.update('none');
    chart.update();
}

export const SelectionBiasPlots = ({ y_values, x_values, coverage, rr, cov_thres }) => {

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'original',
                stack: 'Stack 0',
                data: y_values,
                pointRadius: 0,
                fill: true,
                backgroundColor: ["#E5E5E5", "#67A3FF30"],
                borderWidth: 1,
                borderColor: ["#6B6B6B", "#244CB1"],
                barPercentage: 0.6,
                categoryPercentage: 0.8,
                //maxBarThickness: 20,
                datalabels: {
                    offset: 0,
                }
            },
            {
                label: 'generated',
                stack: 'Stack 0',
                data: [0, 1000],
                pointRadius: 0,
                fill: true,
                backgroundColor: ["#E5E5E5", "#D6424230"],
                borderWidth: 1,
                borderColor: ["#6B6B6B", "#B70808"],
                barPercentage: 0.6,
                categoryPercentage: 0.8,
                //maxBarThickness: 20,
                datalabels: {
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
                color: function (context) {
                    if (context.dataset.label === "generated" & context.dataIndex === 1) {
                        return "#B70808";
                    }
                    else if (context.dataset.label === "original" & context.dataIndex === 1) {
                        return "#244CB1";
                    }
                    else {
                        return "#6B6B6B";
                    }
                },
                anchor: function (context) {
                    console.log(context)
                    if (context.dataIndex == 1) {
                        return "center";
                    }
                    else if (context.dataIndex == 0) {
                        return "end";
                    }
                },

                align: function (context) {
                    if (context.dataIndex == 1) {
                        return "center";
                    }
                    else if (context.dataIndex == 0) {
                        return "top";
                    }
                },
                formatter: function (value, context) {
                    if (context.dataset.label === "generated" & context.dataIndex === 1) {
                        return "generated";
                    }
                    else if (context.dataset.label === "original" & context.dataIndex === 1) {
                        return "original";
                    }
                    else if (context.dataset.label === "original" & context.dataIndex === 0) {
                        return "not selected during generation";
                    }
                    else {
                        return "";
                    }
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
                        let label = "Data Counts " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label + "";
                    },
                    title: function (context) {
                        let label = "";
                        if (context.label !== null) {
                            label += context[0].label;
                        }
                        //return label.replaceAll(",", " ");
                        return "";
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
                    borderColor: '#999999',
                    drawTicks: false,
                },
                min: 0,
                max: Math.max.apply(Math, y_values) * 1.5,
                ticks: {
                    padding: 0,
                    color: "#6B6B6B",
                    font: {
                        size: 8
                    }
                },
                title: {
                    display: true,
                    text: 'No. of samples',
                    color: "#6B6B6B",
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
                    borderColor: '#999999',
                    drawTicks: false,
                },
                ticks: {
                    padding: 1,
                    color: "#6B6B6B",
                    font: {
                        size: "12vh"
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
            /*
            const fontHeight = 0.25 * height;
            ctx.font = `bolder ${fontHeight / 2}px Roboto`;
            ctx.fillStyle = '#D64242';
            ctx.textAlign = 'right';
            ctx.fillText('Threshold:', right, y.getPixelForValue(cov_thres) - top - (0.1 * height))
            ctx.fillText(`${cov_thres}`, right, y.getPixelForValue(cov_thres) - top)
            // Threshold Line   
            ctx.strokeStyle = "#D64242";
            //ctx.setLineDash([5, 10]);
            ctx.strokeRect(left, y.getPixelForValue(cov_thres), width, 0);
            */
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
            ctx.fillStyle = '#999999';
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            //Arrow heads - right
            ctx.beginPath();
            ctx.moveTo(right, bottom - arrowWidth);
            ctx.lineTo(right, bottom + arrowWidth);
            ctx.lineTo(right + 5, bottom);
            ctx.fillStyle = '#999999';
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }

    data.labels = labelWrapper(x_values);

    data.datasets[0].data = y_values;

    const chartRef = useRef();

    return (<div className="ba-bar-container">
        <Bar
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            plugins={[ChartDataLabels, thresholdLine]}
        />
    </div>);
};