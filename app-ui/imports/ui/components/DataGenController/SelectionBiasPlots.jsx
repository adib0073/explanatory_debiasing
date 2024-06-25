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

function fillList(my_list, second_list) {
    let secondListIndex = 0;
    let third_list = my_list.map((value, index) => {
        if (value) {
            return second_list[secondListIndex++];
        } else {
            return 0;
        }
    });
    return third_list;
}

export const SelectionBiasPlots = ({
    orig_data,
    gen_data,
    x_values,
    selectedStatus
}) => {

    let parsed_gen_data = fillList(selectedStatus, gen_data);

    let origColor = [];
    let origBorderColor = [];
    let genColor = [];
    let genBorderColor = [];

    for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i]) {
            origColor.push("#67A3FF30");
            origBorderColor.push("#244CB1");
            genColor.push("#D6424230");
            genBorderColor.push("#B70808");
        }
        else {
            origColor.push("#E5E5E5");
            origBorderColor.push("#6B6B6B");
            genColor.push("#E5E5E5");
            genBorderColor.push("#6B6B6B");
        }
    };

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'original',
                stack: 'Stack 0',
                data: orig_data,
                pointRadius: 0,
                fill: true,
                backgroundColor: origColor,
                borderWidth: 1,
                borderColor: origBorderColor,
                barPercentage: 0.7,
                categoryPercentage: 0.85,
                //maxBarThickness: 20,
                datalabels: {
                    offset: 0,
                }
            },
            {
                label: 'generated',
                stack: 'Stack 0',
                data: parsed_gen_data,
                pointRadius: 0,
                fill: true,
                backgroundColor: genColor,
                borderWidth: 1,
                borderColor: genBorderColor,
                barPercentage: 0.7,
                categoryPercentage: 0.85,
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
                    if (!selectedStatus[context.dataIndex]) {
                        return "#6B6B6B";
                    }
                    else {
                        if (context.dataset.label === "generated") {
                            return "#B70808";
                        }
                        else if (context.dataset.label === "original") {
                            return "#244CB1";
                        }
                    }
                },
                anchor: function (context) {
                    if (selectedStatus[context.dataIndex]) {
                        if (context.dataset.label === "generated") {
                            return "end";
                        }
                        else {

                            return "center";
                        }
                    }
                    else {
                        return "end";
                    }
                },

                align: function (context) {
                    if (selectedStatus[context.dataIndex]) {
                        if (context.dataset.label === "generated") {
                            return "top";
                        }
                        else {

                            return "center";
                        }
                    }
                    else {
                        return "top";
                    }
                },
                formatter: function (value, context) {
                    if (!selectedStatus[context.dataIndex]) {
                        return "not selected" + "\n" + "during generation";
                    }
                    else {
                        if (context.dataset.label === "generated") {
                            return "generated";
                        }
                        else if (context.dataset.label === "original") {
                            return "original";
                        }
                        else {
                            return "";
                        }
                    }
                },
                textAlign: 'center',
                font: function (context) {
                    var width = context.chart.width;
                    var size = Math.round(width / 48);
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
                        if (context.dataset.label === "generated") {
                            label = "Generated data samples " || '';
                        }
                        else if (context.dataset.label === "original") {
                            label = "Original data samples " || '';
                        }

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
                max: (Math.max.apply(Math, orig_data) + Math.max.apply(Math, parsed_gen_data)) * 1.2,
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

    data.datasets[0].data = orig_data;
    data.datasets[1].data = parsed_gen_data;

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