import d3 from 'd3';
import _ from 'lodash';
import './style.less';

export default class Chart {
    constructor(config) {
        this.config = config;
    }

    /**
     * render the chart using the supplied data set
     */
    render(data) {
        this.data = data;
        this.init();
        this.update();
    }

    init() {
        this.svg = d3.select(this.config.el).append('svg');

        this.container = this.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

        this.xScale = d3.scale.linear();
        this.xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('top')
                .tickFormat((label) => `${label}`)
                .tickSize(1);

        this.colorScale = d3.scale.category20();

        this.container.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(${this.config.gutterWidth}, 0)`)
            .call(this.xAxis);

        // todo: use config sizes if set instead of sizing to the window
        d3.select(window).on('resize', () => {
            this.resize();
            this.update();
        });
        this.resize();
    }

    /**
     * update the chart with any data changes that have occurred
     */
    update() {
        let events = this.data.events;
        let lanes = this.generateLanes(events);

        this.rescale(events);
        this.renderGutter(lanes);
        this.renderEvents(events, lanes);
    }

    renderGutter(lanes) {
        let labels = this.container.selectAll('text.label.gutter')
            .data(_.values(lanes));

        // enter
        labels.enter().append('svg:text')
            .attr('class', 'label gutter')
            .attr('x', this.xScale(0))
            // center vertically within each position slot
            .attr('y', (lane) => (lane.position * this.config.laneHeight) + (this.config.laneHeight / 2))
            .attr('dy', '0.5em')
            .text((lane) => lane.id);
    }

    renderEvents(events, lanes) {
        // data join
        let events = this.container.selectAll('rect')
            .data(events, this.eventKey);

        // update
        events //.transition()
            .attr('x', (event) => this.xScale(event.start) + this.config.gutterWidth)
            .attr('width', (event) => this.xScale(event.end - event.start))
            //.duration(700)
            //.ease('elastic');

        // enter
        events.enter().append('rect')
            .attr('class', 'event')
            .attr('fill', (event) => this.colorScale(lanes[event.source].position))
            .attr('x', (event) => this.xScale(event.start) + this.config.gutterWidth)
            .attr('width', (event) => this.xScale(event.end - event.start))
            .attr('y', (event) => lanes[event.source].position * (this.config.laneHeight + this.config.laneSpacing))
            .attr('height', this.config.laneHeight);

        // exit
        events.exit().remove();
    }

    /**
     * adjust the chart axes
     */
    rescale(events) {
        this.xScale.domain([0, d3.max(events, (event) => event.end)]);
        d3.select('.x.axis')
            // .transition()
            // .duration(200)
            // .ease('linear')
            .call(this.xAxis);
    }

    resize() {
        let width = window.innerWidth,
            height = window.innerHeight;

        this.svg.attr('width', width).attr('height', height);
        this.svg.size([width, height]);

        let containerWidth = width - this.config.gutterWidth
                            - this.config.margin.left - this.config.margin.right;

        this.xScale.range([0, containerWidth]);
    }

    /**
     * unique identifier for each event
     */
    eventKey(event) {
        return `${event.id}:${event.start}:${event.end}`;
    }

    /**
     * derive unique lanes objects from event.source id and event.dest id
     */
    generateLanes(events) {
        let lanes = events.reduce((lanes, event) => {
            this.updateLaneStats(lanes, {event, id: event.source});
            this.updateLaneStats(lanes, {event, id: event.dest});
            return lanes;
        }, {});
        return this.assignLanePositions(lanes);
    }

    /**
     * create or update lane info from an event + id
     */
    updateLaneStats(lanes, {event, id}) {
        if (lanes[id] === undefined) {
            lanes[id] = {
                id: id,
                start: event.start,
                end: event.end
            }
        }
        if (event.start < lanes[id].start) {
            lanes[id].start = event.start;
        }
        if (event.end > lanes[id].end) {
            lanes[id].end = event.end;
        }
    }

    /**
     * assign a position index to each lane
     */
    assignLanePositions(lanes) {
        let sorted = _.sortBy(lanes, this.config.sortLanes);
        sorted.forEach((lane, i) => {
            lane['position'] = i;
        });
        return _.indexBy(sorted, 'id');
    }

    /**
     * add a new event to the chart
     */
    addEvent(event) {
        this.data.events.push(event);
        this.update();
    }
}