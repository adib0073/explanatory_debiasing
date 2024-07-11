import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './DataGenController.css'

const labelWrapper = (value) => {
    let wrappedArray = []
    for (let i = 0; i < value.length; i++) {
        if (typeof (value[i]) === typeof ("string")) {
            wrappedArray.push(value[i].split(" "));

        }
        else {
            wrappedArray.push(value[i]);
        }
    }
    return wrappedArray;
};

export const GenBiasPlots = ({
    y_values, x_values
}) => {

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'original data',
                stack: 'Stack 0',
                data: y_values[0],
                pointRadius: 0,
                fill: true,
                backgroundColor: "#67A3FF30",
                borderColor: "#244CB1",
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 0.5,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'center',
                    align: 'center',
                    offset: 0,
                }
            },
            {
                label: 'generated data',
                stack: 'Stack 1',
                data: y_values[1],
                pointRadius: 0,
                fill: true,
                backgroundColor: "#be95ff30",
                borderWidth: 1,
                borderColor: "#6929c4",
                barPercentage: 1,
                categoryPercentage: 0.5,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'center',
                    align: 'center',
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
                    return value + "%";
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
                        let label = "Score " || '';

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
                    text: 'System Scores',
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

    data.labels = labelWrapper(x_values);

    data.datasets[0].data = y_values[0];
    data.datasets[1].data = y_values[1];

    const chartRef = useRef();

    return (<div className="ba-bar-container">
        <Bar
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            plugins={[ChartDataLabels]}
        />
    </div>);
};