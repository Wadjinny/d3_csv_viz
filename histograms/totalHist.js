const totalHist = (data) => {
    const { realWidth, realHeight, margin, width, height, fontSize } = PLOT_CONFIG;
    // Append the chart container to the body of the HTML document
    const svg = d3.select('#figure-holder').append('svg')
        .attr('id', 'Total')
        .attr('width', realWidth)
        .attr('height', realHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const key = 'Total'
    const value = data.length

    const x = d3.scaleBand()
        .domain([key])
        .range([margin.left, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, value])
        .range([height, margin.top]);


    // setup and draw the bars
    svg.append("rect")
        .attr("x", x(key))
        .attr("y", y(value))
        .attr("width", x.bandwidth())
        .attr("height", y(0) - y(value))
        .style("fill", "#a63ed9")


    // setup and draw the occurrences text
    svg.append("text")
        .text(value)
        .attr("x", d => x(key) + x.bandwidth() / 2)
        .attr("y", d => y(value) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", `${fontSize}px`)
        .style("fill", "black");

    // Draw the x-axis
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('id', 'x-axis')
        .call(d3.axisBottom(x));

    // Draw the y-axis
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    svg.selectAll("#x-axis text")
        // .call(wrapText, 10)
        .style("text-anchor", "middle")
        // .attr("transform", "rotate(45)")
        .style("font-size", `${fontSize}px`)

    svg.selectAll("#y-axis text")
        .style("font-size", `${fontSize}px`)
}