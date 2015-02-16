import d3 from 'd3';
import './style.less';

let config = {
    el: 'body',
    width: 1000,
    height: 500,
    margin: {
        left: 30,
        top: 30
    }
};

let xScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, config.width]);

let svg = d3.select(config.el).append('svg')
    .attr('width', config.width)
    .attr('height', config.height)
    .on('click', () => {
        console.log('clkjvd');
    });

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

container.each((d, i) => {
    console.log(d, i);
});

let block = container.append('rect')
    .attr('class', 'square')
    .attr('x', 100)
    .attr('y', 100)
    .attr('width', 200)
    .attr('height', 200);

block.transition()
    .attr('x', 200)
    .duration(1000)
    .ease('elastic');

