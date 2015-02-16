import d3 from 'd3';
import './style.less';

let config = {
    el: 'body',
    width: 1000,
    height: 500,
    margin: {
        left: 30,
        top: 30
    },
    gutterWidth: 100
};

let xScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, config.width]);

let svg = d3.select(config.el).append('svg')
    .attr('width', config.width)
    .attr('height', config.height);

let container = svg.append('g')
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

let xAxis = container.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${config.height - 100})`)
    .call(d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat((d) => `${d}s`)
        .tickSize(1)
    );

function render(data) {
    renderGutter(data);
    renderBlocks(data);
}

function renderGutter(data) {
    let labels = container.selectAll('text.label.gutter')
        .data(data, (d) => d.id);

    // enter
    labels.enter().append('svg:text')
        .attr('class', 'label gutter')
        .attr('x', xScale(0))
        .attr('y', (d, i) => (i * 60) + 50/2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text((d) => d.id);
}

function renderBlocks(data) {
    // data join
    let blocks = container.selectAll('rect')
        .data(data, (d) => d.id);

    // update
    blocks.transition()
        .attr('x', (d) => d.start + config.gutterWidth)
        .duration(1000)
        .ease('elastic');

    // enter
    blocks.enter().append('rect')
        .attr('class', 'block')
        .attr('x', (d) => d.start + config.gutterWidth)
        .attr('y', (d, i) => i * 60)
        .attr('width', (d) => d.end - d.start)
        .attr('height', 50)
        .on('click', (d) => {
            data[0].start = 50;
            let updatedData = [data[0]];
            render(updatedData);
        });

    // exit
    blocks.exit().remove();
}

let initialData = [{
    id: 1,
    start: 0,
    end: 100
}, {
    id: 2,
    start: 30,
    end: 200
}];

render(initialData);
