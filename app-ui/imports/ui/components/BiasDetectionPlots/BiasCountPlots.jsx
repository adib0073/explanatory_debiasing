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


export const BiasCountPlots = ({ y_values, x_values, coverage, rr}) => {

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'sample counts',
                data: y_values,
                pointRadius: 0,
                fill: true,
                backgroundColor: ["#67A3FF", "#244CB1"],
                borderColor: ["#67A3FF", "#244CB1"],
                barPercentage: 0.6,
                categoryPercentage: 0.8,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: 8,
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
                    return "RR: "+ rr[context.dataIndex] + "\n" +"coverage :" + coverage[context.dataIndex];
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
                        let label = "Proportion " || '';

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
        layout:{
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
                max: Math.max.apply(Math, y_values) * 2,
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
                        size: "12vh"
                    }
                },
                text: "Features",
            }
        },
    };

    data.labels = labelWrapper(x_values);

    data.datasets[0].data = y_values;

    const chartRef = useRef();

    return (<div className="BarPlotContainer">
        <Bar
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            //onMouseDown={onDown}
            //onMouseUp={onUp}
            plugins={[ChartDataLabels]}
        />
    </div>);
};