'use strict';
(function(data, d3) {

    var mapProp = function(d, prop) {
        return d.map(function(item) {
            return item[prop];
        });
    };

    var max = function(value, prop) {
        return d3.max(value, function(d) {
            return prop ? d[prop] : d;
        });
    };

    var scaleLinear = function(values) {
        return d3.scale.linear()
            .domain([values.startDomain, values.endDomain])
            .range([values.startRange, values.endRange]);
    };

    var scaleOrdinal = function(values) {
        var padding = values.padding || 0;
        var outerPadding = values.outerPadding || 0;
        return d3.scale.ordinal()
            .domain(values.domain)
            .rangeBands([values.startRange, values.endRange], padding, outerPadding);
    };

    var axis = function(prop, orient, ticks) {
        ticks = ticks || 10;
        return d3.svg.axis()
            .scale(prop)
            .ticks(ticks)
            .orient(orient);
    };

    var renderBarChart = function(values) {

        var container = d3.select(values.container);

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var val1 = d[values.dataKeys[0]];
                var val2 = d[values.dataKeys[1]];
                return '<strong>' + val1 + " </strong> <span style='color:red'>" + val2 + '</span>';
            });

        var svg = container.append('svg')
            .attr('width', values.outerWidth)
            .attr('height', values.outerHeigth);

        svg.call(tip);

        var barsContainer = svg.append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + values.marginL + ',' + values.marginT + ')');

        var bar = barsContainer.selectAll('g')
            .data(values.data)
            .enter().append('g')
            .attr('transform', function(d) {
                var key = values.dataKeys[0];
                return 'translate(' + values.getX(d[key]) + ',0)';
            })
            .attr('class', 'bar')
            .on('click', values.clickHandler)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        bar.append('rect')
            .attr('y', function(d) {
                var key = values.dataKeys[1];
                return values.getY(d[key]);
            })
            .attr('height', function(d) {
                var key = values.dataKeys[1];
                return values.height - values.getY(d[key]);
            })
            .attr('width', values.getX.rangeBand());

        barsContainer.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + values.height + ')')
            .call(axis(values.getX, 'bottom'));

        barsContainer.append('g')
            .attr('class', 'y axis')
            .call(axis(values.getY, 'left'));
    };

    // -------------------------
    var margin = {
            top: 50,
            right: 20,
            bottom: 40,
            left: 50
        },
        outerWidth = 460,
        outerHeigth = 300;

    var width = outerWidth - margin.left - margin.right;
    var height = outerHeigth - margin.top - margin.bottom;

    var x = scaleOrdinal({
        domain: mapProp(data, 'label').sort(),
        startRange: 0,
        endRange: width,
        padding: 0.1,
        outerPadding: 0.1
    });

    var y = scaleLinear({
        startDomain: 0,
        endDomain: max(data, 'value'),
        startRange: height,
        endRange: 0
    });

    var clickHandler = function(d) {
        console.log('label:' + d.label + ' value:' + d.value);
    };

    renderBarChart({
        data: data,
        dataKeys: ['label', 'value'],
        container: '#root',
        marginL: margin.left,
        marginT: margin.top,
        width: width,
        height: height,
        outerWidth: outerWidth,
        outerHeigth: outerHeigth,
        getX: x,
        getY: y,
        clickHandler: clickHandler
    });

}([
    { label: 'B', value: 8 },
    { label: 'E', value: 23 },
    { label: 'A', value: 4 },
    { label: 'D', value: 16 },
    { label: 'F', value: 45 },
    { label: 'C', value: 15 },
    { label: 'G', value: 22 }

], window.d3));
