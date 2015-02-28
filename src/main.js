import Chart from './Chart';

let chart = new Chart({
    el: '#viz',
    width: 800,
    height: 300,
    margin: {
        left: 30,
        top: 30
    },
    gutterWidth: 100
});

// load data from somewhere...
import data from './data.json';

chart.render(data);