// An object with the dimensions of the plot area
// The plot area is the area within the margins
const PLOT_CONFIG = {
    realHeight: 280,
    realWidth: 310,
    fontSize: 11,
    get margin() {
        return {
            top: this.realHeight * 0.05,
            right: this.realWidth * 0.00,
            bottom: this.realHeight * 0.2,
            left: this.realWidth * 0.1
        }
    },
    get width() {
        return this.realWidth - this.margin.left - this.margin.right
    },
    get height() {
        return this.realHeight - this.margin.top - this.margin.bottom
    },
}