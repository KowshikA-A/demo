import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import Line chart
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './CTCChart.css'; // If you are using a separate CSS file

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CTCChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Fetch data from the backend
        axios.get('/api/students/ctc-by-school-year')
            .then(response => {
                const data = response.data;
                console.log('Backend data:', data); // Debug: Check data structure

                if (!data || data.length === 0) {
                    console.log("No data received");
                    setLoading(false);
                    return;
                }

                // Get unique schools and years
                const schools = [...new Set(data.map(item => item.school))];
                const years = [...new Set(data.map(item => item.year))].sort((a, b) => a - b); // Sort years numerically

                // Create color palette for each school
                const colors = schools.map((_, index) => `hsl(${(index * 360) / schools.length}, 70%, 50%)`);

                // Initialize datasets for each school
                const datasets = schools.map((school, index) => {
                    // Get max CTC data for each school and year
                    const schoolData = years.map(year => {
                        const item = data.find(d => d.school === school && d.year === year);
                        return item ? item.maxCTC : null; // Return max CTC or null if no data
                    });

                    console.log(`${school} Data:`, schoolData); // Debug: Check data for each school

                    return {
                        label: school,
                        data: schoolData,
                        backgroundColor: 'transparent', // No background for lines
                        borderColor: colors[index], // Different color for each school
                        borderWidth: 2, // Width of the line
                        fill: false, // Do not fill under the line
                        tension: 0.4 // Smooth curve
                    };
                });

                // Set the data for the chart
                setChartData({
                    labels: years,
                    datasets
                });
                setLoading(false); // Stop loading after data is set
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false); // Stop loading on error
            });
    }, []);

    return ( <
            div >
            <
            h2 > Max CTC by School and Year < /h2> {
            loading ? ( <
                p > Loading chart data... < /p>
            ) : chartData ? ( <
                div className = "chart-container" >
                <
                Line data = { chartData }
                options = {
                    {
                        responsive: true,
                        maintainAspectRatio: false, // Allow height to be controlled
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                beginAtZero: false, // Adjust Y-axis to start from the lowest CTC value
                                title: {
                                    display: true,
                                    text: 'CTC in LPA'
                                },
                                ticks: {
                                    callback: function(value) {
                                        return value + ' LPA'; // Format the Y-axis values as 'LPA'
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    boxWidth: 20, // Size of the box next to each legend item
                                    padding: 15 // Padding between legend items
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return tooltipItem.raw + ' LPA'; // Format tooltips
                                    }
                                }
                            }
                        }
                    }
                }
                /> < /
                div >
            ) : ( <
                p > No data available to display. < /p>
            )
        } <
        /div>
);
};

export default CTCChart;