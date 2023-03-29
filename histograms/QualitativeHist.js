class QualitativeHist {
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

        const column_data = data.map(d => d[this.columnName])

        // Group data by unique values and count occurrences
        const counts = d3.rollup(column_data, v => v.length, d => d);

        // Convert data to an array of objects
        const dataArr = Array.from(counts, ([key, value]) => ({ key, value }));
        dataArr.sort((a, b) => b.value - a.value);

        const x = d3.scaleBand()
            .domain(dataArr.map(d => d.key))
            .range([margin.left, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataArr, d => d.value)])
            .range([height, margin.top]);

        const mouseenter = function (e, d) {
            d3.select(this).style("fill", self.color2);
            histList.forEach(hist => {
                //filter data for the specific d.key
                if (hist.columnName != columnName) {
                    const filteredData = data.filter(d_e => d_e[columnName] == d.key)
                    hist.update(filteredData, hist.color2)
                }
            })
        }
        const mouseleave = function (d) {
            histList.forEach(hist => {
                if (hist.columnName != columnName) {
                    hist.update(data, hist.color1)
                }
            })
            d3.select(this).style("fill", self.color1);
        }
        // setup and draw the bars
        this.bars = this.svg.selectAll("rect")
            .data(dataArr)
            .enter()
            .append("rect")
            .attr("x", d => x(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.value))
            .style("fill", "#a63ed9")
            .on("mouseenter", mouseenter)
            .on("mouseleave", mouseleave)

        // setup and draw the occurrences text
        this.occurences = this.svg.selectAll("text")
            .data(dataArr)
            .enter()
            .append("text")
            .text(d => d.value)
            .attr("x", d => x(d.key) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", `${fontSize}px`)
            .style("fill", "black");

        // Draw the x-axis
        this.x_axis = this.svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .attr('id', 'x-axis')
            .call(d3.axisBottom(x))
        this.x_axis.selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "rotate(45)")
            .style("font-size", `${fontSize}px`)

        // Draw the y-axis
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
        const column_data = newData.map(d => d[this.columnName])
        const counts = d3.rollup(column_data, v => v.length, d => d);
        const dataArr = Array.from(counts, ([key, value]) => ({ key, value }));
        dataArr.sort((a, b) => b.value - a.value);
        // console.log(dataArr)
        const x = d3.scaleBand()
            .domain(dataArr.map(d => d.key))
            .range([PLOT_CONFIG.margin.left, PLOT_CONFIG.width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataArr, d => d.value)])
            .range([PLOT_CONFIG.height, PLOT_CONFIG.margin.top]);

        this.bars.data(dataArr)
            .transition()
            .duration(1000)
            .attr("x", d => x(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.value))
            .style("fill", color || this.color1)


        this.occurences.data(dataArr)
            .transition()
            .duration(1000)
            .text(d => d.value)
            .attr("x", d => x(d.key) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", `${PLOT_CONFIG.fontSize}px`)
            .style("fill", "black");

        this.x_axis.transition()
            .duration(1000)
            .call(d3.axisBottom(x));

        this.y_axis.transition()
            .duration(1000)
            .call(d3.axisLeft(y))
            .selectAll("text")
            .text(thousands_2_k)

    }

}
