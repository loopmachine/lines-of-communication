import d3 from 'd3';
import './style.less';

let config = {
    el: '#viz',
    width: 800,
    height: 300,
    margin: {
        left: 30,
        top: 30
    },
    gutterWidth: 100
};

let xScale = d3.scale.linear()
    .domain([0, 0])
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

function render() {
    renderGutter();
    renderBlocks();

    xScale.domain([0, data.length]);
    d3.transition(container).select('.x.axis')
        .call(xAxis);
}

function renderGutter() {
    let labels = container.selectAll('text.label.gutter')
        .data(data, key);

    // enter
    labels.enter().append('svg:text')
        .attr('class', 'label gutter')
        .attr('x', xScale(0))
        .attr('y', (d) => (d.line * 60) + 50/2)
        .attr('dy', '0.5em')
        .text((d) => `-- ${d.line} --`)
        .on('click', (d) => addBlock({
            line: d.line,
            start: 120 + (data.length * 20),
            end: 130 + (data.length * 20)
        }));
}

function renderBlocks() {
    // data join
    let blocks = container.selectAll('rect')
        .data(data, key);

    // update
    blocks.transition()
        .attr('x', (d) => d.start + config.gutterWidth)
        .duration(1000)
        .ease('elastic');

    // enter
    blocks.enter().append('rect')
        .attr('class', 'block')
        .attr('x', (d) => d.start + config.gutterWidth)
        .attr('y', (d) => d.line * 60)
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

let data = [];
let key = (d) => `${d.line}:${d.start}:${d.end}`;

function addBlock(block) {
    data.push(block);

    d3.transition()
      .duration(200)
      .ease('linear')
      .each(render);
}

addBlock({
    line: 0,
    start: 0,
    end: 20
});
addBlock({
    line: 1,
    start: 0,
    end: 20
});
