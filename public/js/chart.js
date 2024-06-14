import Chart from 'chart.js/auto';

exports.LineChart =() => {
    const xValues = ["Sun", "Mon", "Tue", "Wed", "Thu", "fri", "Sat"];
    const yValues = [5533, 300, 3344, 2433, 1598, 3400, 5000];
    // const barColors = ["red", "green","blue","orange","brown"];
    
    new Chart("myChart", {
    type: "line",
    data: {
    labels: xValues,
    datasets: [{
        // backgroundColor: barColors,
        label: "Weekly Views",
        data: yValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.6
    }]
    },
    //options: {...}
    });
} 