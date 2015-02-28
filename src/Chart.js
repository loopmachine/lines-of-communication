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
        let containerWidth = this.config.width - this.config.gutterWidth
                            - this.config.margin.left - this.config.margin.right;

        this.xScale = d3.scale.linear()
            .range([0, containerWidth]);

        let svg = d3.select(this.config.el).append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);

        this.container = svg.append('g')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        this.xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('top')
                .tickFormat((d) => `${d}`)
                .tickSize(1);

        this.container.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(${this.config.gutterWidth}, 0)`)
            .call(this.xAxis);
    }
    /**
     * update the chart with any data changes that have occurred
     */
    update() {
        let lanes = this.lanesFrom(this.data.events);

        this.renderGutter(lanes);
        this.renderEvents(this.data.events);
        this.rescale(this.data.events);
    }
    renderGutter(lanes) {
        let labels = this.container.selectAll('text.label.gutter')
            .data(lanes);

        // enter
        labels.enter().append('svg:text')
            .attr('class', 'label gutter')
            .attr('x', this.xScale(0))
            .attr('y', (d, i) => (i * 60) + 25)
            .attr('dy', '0.5em')
            .text((d) => d);
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
            .attr('height', 50);

        // exit
        events.exit().remove();
    }
    rescale(events) {
        this.xScale.domain([0, d3.max(this.data.events, (event) => event.end)]);
        d3.select('.x.axis')
            .transition()
            .duration(200)
            .ease('linear')
            .call(this.xAxis);
    }
    eventKey(event) {
        return `${event.line}:${event.start}:${event.end}`;
    }
    lanesFrom(events) {
        return Array.from(events.reduce((lanes, event) => {
            lanes.add(event.source);
            lanes.add(event.dest);
            return lanes;
        }, new Set()));
    }
}