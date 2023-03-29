class QuantitativeHist {
    constructor(data, columnName, histList) {
        this.color1 = "#a63ed9"
        this.color2 = "rgb(246 149 255)"
        const self = this
        this.columnName = columnName;
        const { realWidth, realHeight, margin, width, height, fontSize } = PLOT_CONFIG;
        // Append the chart container to the body of the HTML document
        this.svg = d3.select('#figure-holder').append('svg')
            .attr('id', this.columnName)
            .attr('width', realWidth)
            .attr('height', realHeight)
            .style('display', 'none')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const column_data = data.map(d => +d[this.columnName])


        const x = d3.scaleLinear()
            .domain([d3.min(column_data), d3.max(column_data)])
            .range([margin.left, width])


        const hist = d3.histogram()
            .value(d => d)
            .domain(x.domain())
            .thresholds(x.ticks(20));

        const bins = hist(column_data);
        const y = d3.scaleLinear()
            .range([height, margin.top])
            .domain([0, d3.max(bins, d => d.length)])


        const mouseenter = function (e, d) {
            histList.forEach(hist => {
                if (hist.columnName !== columnName) {
                    const newData = data.filter(d_e => d.x0 <= +d_e[columnName] && +d_e[columnName] < d.x1)
                    hist.update(newData, hist.color2)
                }
            })
            d3.select(this).style("fill", self.color2);

        }
        const mouseleave = function (d) {
            histList.forEach(hist => {
                if (hist.columnName !== columnName) {
                    hist.update(data, hist.color1)
                }
            })
            d3.select(this).style("fill", self.color1);
        }

        // setup and draw the bars
        this.bars = this.svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", d => `translate(${x(d.x0)}, ${y(d.length)})`)
            .attr("width", d => x(d.x1) - x(d.x0))
            .attr("height", d => height - y(d.length))
            .style("fill", this.color1)
            .on("mouseenter", mouseenter)
            .on("mouseleave", mouseleave)

        this.x_axis = this.svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .attr('id', 'x-axis')
            .call(d3.axisBottom(x))
        this.x_axis.selectAll("text")
            .style("font-size", `${fontSize}px`)


        this.y_axis = this.svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y))
        this.y_axis.selectAll("text")
            .style("font-size", `${fontSize}px`)
            .text(thousands_2_k)

        // add plot title
        this.svg.append("text")
            .attr("x", (width / 2))
            .attr("y", height + margin.bottom * .7)
            .attr("text-anchor", "middle")
            .style("font-size", `${fontSize * 1.3}px`)
            .style("font-weight", "bold")
            .style("fill", "#484848")
            .text(this.columnName);
    }
    
    update(newData, color) {
        const column_data = newData.map(d => +d[this.columnName])
        const x = d3.scaleLinear()
            .domain([d3.min(column_data), d3.max(column_data)])
            .range([PLOT_CONFIG.margin.left, PLOT_CONFIG.width])

        const hist = d3.histogram()
            .value(d => d)
            .domain(x.domain())
            .thresholds(x.ticks(20));

        const bins = hist(column_data);

        const y = d3.scaleLinear()
            .range([PLOT_CONFIG.height, PLOT_CONFIG.margin.top])
            .domain([0, d3.max(bins, d => d.length)])

        this.bars
            .data(bins)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${x(d.x0)}, ${y(d.length)})`)
            .attr("width", d => x(d.x1) - x(d.x0))
            .attr("height", d => PLOT_CONFIG.height - y(d.length))
            .style("fill", color || this.color1)

        this.x_axis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(x));

        this.y_axis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y))
            .selectAll('text')
            .text(thousands_2_k)

    }

}