require('babel/polyfill');

import Chart from './Chart';

let chart = new Chart({
    el: '#viz',
    width: 1000,
    height: 300,
    margin: {
        left: 30,
        right: 30,
        top: 30,
        botton: 0
    },
    gutterWidth: 100,
    laneHeight: 50,
    laneSpacing: 0
});

// load data from somewhere...
import data from './data.json';

chart.render(data);