import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './BiasPlots.css'


const labelWrapper = (value) => {
    let wrappedArray = []
    for (let i = 0; i < value.length; i++) {
        wrappedArray.push(value[i].split(" "));
    }
    return wrappedArray;
};


export const BiasAccPlots = ({ y_values, x_values, acc_thres }) => {

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'diabetic',
                stack: 'Stack 0',
                data: y_values[0],
                pointRadius: 0,
                fill: true,
                backgroundColor: "#67A3FF",
                borderColor: "#67A3FF",
                barPercentage: 1,
                categoryPercentage: 0.6,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                }
            },
            {
                label: 'non-diabetic',
                stack: 'Stack 1',
                data: y_values[1],
                pointRadius: 0,
                fill: true,
                backgroundColor: "#999999",
                borderColor: "#999999",
                barPercentage: 1,
                categoryPercentage: 0.6,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                }
            }
        ],
    };

    const options = {
        animation: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "right",
                align: "center",
                textAlign: "right",
                rtl: true,
                labels: {
                    boxWidth: 10,
                    padding: 5,
                    color: "#000000",
                    font: {
                        size: "9vh"
                    }
                }
            },
            datalabels: {
                color: "#000",
                formatter: function (value, context) {
                    return "";
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
                        let label = "Accuracy " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label + "%";
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
                left: 0,
                right: 0,
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
                max: 100,
                ticks: {
                    padding: 0,
                    color: "#000000",
                    font: {
                        size: 8
                    }
                },
                title: {
                    display: true,
                    text: 'Accuracy',
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
                        size: "12vh"
                    }
                },
                text: "Features",
            }
        },
    };

    // plugin block
    const thresholdLine = {
        id: 'thresholdLine',
        afterDatasetDraw(chart, args, option) {
            const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
            ctx.save();
            const fontHeight = 0.25 * height;
            ctx.font = `${fontHeight / 2}px Roboto`;
            ctx.fillStyle = '#D64242';
            ctx.textAlign = 'right';
            ctx.fillText(`Overall accuracy: ${acc_thres}`, right, y.getPixelForValue(acc_thres) - top)
            // Threshold Line   
            ctx.strokeStyle = "#D64242";
            //ctx.setLineDash([5, 10]);
            ctx.strokeRect(left, y.getPixelForValue(acc_thres), width, 0);
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

    data.datasets[0].data = y_values[0];
    data.datasets[1].data = y_values[1];

    const chartRef = useRef();

    return (<div className="BarPlotContainer">
        <Bar
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            plugins={[ChartDataLabels, thresholdLine]}
        />
    </div>);
};