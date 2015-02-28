import d3 from 'd3';
import './style.less';

export default class Chart {
    constructor(config) {
        this.config = config;
    }
    render(data) {
        this.data = data;
        this.init();
        this.update();
    }
    addEvent(event) {
        this.data.events.push(event);
        this.update();
    }
    init() {
        this.xScale = d3.scale.linear()
            // change this to control the initial scale/transition of the x-axis
            .domain([0, this.data.events.length])
            .range([0, this.config.width]);

        let svg = d3.select(this.config.el).append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.container = svg.append('g')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        this.xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('bottom')
                .tickFormat((d) => `${d}s`)
                .tickSize(1);

        this.container.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(${this.config.gutterWidth}, ${this.config.height - 100})`)
            .call(this.xAxis);
    }
    /**
     * update the chart with any data changes that have occurred
     */
    update() {
        let events = this.data.events;
        this.renderGutter(events);
        this.renderEvents(events);
        this.rescale(events);
    }
    renderGutter(events) {
        let labels = this.container.selectAll('text.label.gutter')
            .data(events, this.eventKey);

        // enter
        labels.enter().append('svg:text')
            .attr('class', 'label gutter')
            .attr('x', this.xScale(0))
            .attr('y', (d) => (d.line * 60) + 50/2)
            .attr('dy', '0.5em')
            .text((d) => `-- ${d.line} --`)
            .on('click', (d) => this.addEvent({
                source: 'a',
                dest: 'b',
                line: d.line,
                start: 120 + (events.length * 20),
                end: 130 + (events.length * 20)
            }));
    }
    renderEvents(events) {
        // data join
        let events = this.container.selectAll('rect')
            .data(events, this.eventKey);

        // update
        events.transition()
            .attr('x', (d) => d.start + this.config.gutterWidth)
            .duration(1000)
            .ease('elastic');

        // enter
        events.enter().append('rect')
            .attr('class', 'event')
            .attr('x', (d) => d.start + this.config.gutterWidth)
            .attr('y', (d) => d.line * 60)
            .attr('width', (d) => d.end - d.start)
            .attr('height', 50)
            .on('click', (d) => this.addEvent({
                source: 'a',
                dest: 'b',
                line: d.line,
                start: 120 + (events.length * 20),
                end: 130 + (events.length * 20)
            }));

        // exit
        events.exit().remove();
    }
    rescale(events) {
        this.xScale.domain([0, events.length]);
        d3.select('.x.axis')
            .transition()
            .duration(200)
            .ease('linear')
            .call(this.xAxis);
    }
    eventKey(event) {
        return `${event.line}:${event.start}:${event.end}`;
    }
    uniqueNodes(events) {
        return events.reduce((nodes, event) => {
            nodes.add(event.source);
            nodes.add(event.dest);
            return nodes;
        }, new Set());
    }
}