import d3 from 'd3';
import './style.less';

const config = {
    el: '#viz',
    width: 800,
    height: 300,
    margin: {
        left: 30,
        top: 30
    },
    gutterWidth: 100
};

// ----------------------------------------------------------------------------

import data from './data.json';

function addEvent(event) {
    data.events.push(event);
    render();
}

// ----------------------------------------------------------------------------

let key = (d) => `${d.line}:${d.start}:${d.end}`;

function getNodes(events) {
    return events.reduce((nodes, event) => {
        nodes.add(event.source);
        nodes.add(event.dest);
        return nodes;
    }, new Set());
}

// ----------------------------------------------------------------------------

let xScale = d3.scale.linear()
    .domain([0, data.events.length])     // change to control the initial scale/transition of the x-axis
    .range([0, config.width]);

let svg = d3.select(config.el).append('svg')
    .attr('width', config.width)
    .attr('height', config.height);

let container = svg.append('g')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

let xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat((d) => `${d}s`)
        .tickSize(1)

container.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(${config.gutterWidth}, ${config.height - 100})`)
    .call(xAxis);

// ----------------------------------------------------------------------------

function render() {
    let events = data.events;
    renderGutter(events);
    renderEvents(events);
    rescale(events);
}

function rescale(events) {
    xScale.domain([0, events.length]);
    d3.select('.x.axis')
        .transition()
        .duration(200)
        .ease('linear')
        .call(xAxis);
}

function renderGutter(events) {
    let labels = container.selectAll('text.label.gutter')
        .data(events, key);

    // enter
    labels.enter().append('svg:text')
        .attr('class', 'label gutter')
        .attr('x', xScale(0))
        .attr('y', (d) => (d.line * 60) + 50/2)
        .attr('dy', '0.5em')
        .text((d) => `-- ${d.line} --`)
        .on('click', (d) => addEvent({
            source: 'a',
            dest: 'b',
            line: d.line,
            start: 120 + (events.length * 20),
            end: 130 + (events.length * 20)
        }));
}

function renderEvents(events) {
    // data join
    let events = container.selectAll('rect')
        .data(events, key);

    // update
    events.transition()
        .attr('x', (d) => d.start + config.gutterWidth)
        .duration(1000)
        .ease('elastic');

    // enter
    events.enter().append('rect')
        .attr('class', 'event')
        .attr('x', (d) => d.start + config.gutterWidth)
        .attr('y', (d) => d.line * 60)
        .attr('width', (d) => d.end - d.start)
        .attr('height', 50)
        .on('click', (d) => addEvent({
            source: 'a',
            dest: 'b',
            line: d.line,
            start: 120 + (events.length * 20),
            end: 130 + (events.length * 20)
        }));

    // exit
    events.exit().remove();
}

// ----------------------------------------------------------------------------

render();