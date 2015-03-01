import Chart from './Chart';

createContainerElement('viz');

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
    ticks: 12,
    gutterWidth: 100,
    laneHeight: 20,
    laneSpacing: 10,
    sortLanes: (lane) => lane.id
});

// load data from somewhere...
import data from './data.json';

chart.render(data);

function createContainerElement(id) {
    var viz = document.createElement('div');
    viz.setAttribute('id', 'viz');
    viz.className = 'viz';
    document.body.appendChild(viz);
}