function thousands_2_k(num_str) {
    // convert a string representing a number to a string representing a number with a k for thousands
    const num = Number(num_str)
    if (num > 999) {
        return `${(num / 1000).toFixed(1)}k`
    } else {
        return num_str
    }
}


const displayTotalPlot = () => {
    // Hide the total plot if all the checkboxes are unchecked
    const allUnchecked = d3.selectAll('input[type=checkbox]').nodes().every(input => !input.checked);
    if (allUnchecked) {
        d3.select('#Total').style('display', 'block')
    } else {
        d3.select('#Total').style('display', 'none')
    }
}


// get_numeric_qualitative_columns
// Takes in a data object with columns and values
// Returns an object with two arrays, one with the names of the columns that are numeric
// and one with the names of the columns that are qualitative

const get_numeric_qualitative_columns = (data) => {
    const columns = data.columns;
    const numeric_columns = columns.filter((column) => {
        const values = data.map(d => d[column]);
        const is_numeric = values.every((value) => {
            return !isNaN(value);
        });
        return is_numeric;
    });
    const qualitative_columns = columns.filter(column => !numeric_columns.includes(column));
    return {
        numeric_columns: numeric_columns,
        qualitative_columns: qualitative_columns
    };
}