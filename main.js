const csv_loaded = (data) => {
    // initialize the layout of the page
    const checkboxs_container = d3.select('body')
        .append('div')
        .attr('id', 'checkboxs-container')
    const btn_container = d3.select('body').append('div')
        .attr('id', 'btn-container')
    const figure_holder = d3.select('body').append('div')
        .attr('id', 'figure-holder');


    // get the quantitative and qualitative columns
    const { numeric_columns, qualitative_columns } = get_numeric_qualitative_columns(data);
    let histList = []
    for (let col of numeric_columns) {
        // draw the quantitative histogram
        histList.push(new QuantitativeHist(data, col, histList));
    }
    for (let col of qualitative_columns) {
        // draw the qualitative histogram
        histList.push(new QualitativeHist(data, col, histList));
    }
    // draw the total plot
    totalHist(data);


    // add the checkboxs and handle the events
    const checkboxsConstructer = function (d) {
        const checkbox_container = d3.select("#checkboxs-container")
            .append('div')
        const label = checkbox_container.append('label')
            .attr('for', d)
            .text(d)
        const checkbox = checkbox_container.append('input')
            .attr('type', 'checkbox')
            .attr('id', d)
            .on('change', (e, d) => {
                
                const checked = checkbox.property('checked');
                const id = checkbox.attr('id');
                if (checked) {
                    d3.select(`svg[id=${id}]`).style('display', 'block');
                } else {
                    d3.select(`svg[id=${id}]`).style('display', 'none');
                }
                displayTotalPlot(data)
            })
    }

    checkboxs_container
        .data(histList.map(hist => hist.columnName))
        .enter()
        .each(checkboxsConstructer)

    const selectAllBtn = btn_container.append('button')
        .attr('id', 'select-all-btn')
        .text('Select All')
    const deselectAllBtn = btn_container.append('button')
        .attr('id', 'deselect-all-btn')
        .text('Deselect All')
    selectAllBtn.on('click', () => {
        d3.selectAll('input').property('checked', true);
        d3.selectAll('svg:not(#Total)').style('display', 'block');
        displayTotalPlot(data);
    })
    deselectAllBtn.on('click', () => {
        d3.selectAll('input').property('checked', false);
        d3.selectAll('svg').style('display', 'none');
        displayTotalPlot(data);
    })

}
// you can choose between different data size
const csv_data = d3.csv('data/heart_2020_6k.csv', (d) => d).then(csv_loaded)
