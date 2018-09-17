import { XYChart } from './xy';
import { LineChartOptions } from './interface';
import * as Plottable from 'plottable';


export class LineChart extends XYChart {
  options: LineChartOptions;
  yScale: Plottable.Scales.Linear;
  constructor(
      target: string | HTMLElement,
      data: any[][],
      options: any) {
    super(target, data, options);
    this.plots = this.getPlots();
    this.table = this.getTable();
    this.render();
  }

  getDefaultOptions() : LineChartOptions {
    return {
      ...super.getDefaultOptions(),
      lineWidth: 2,
      yType: 'numeric'
    };
  }

  getPlots() : Plottable.Components.Group {
    let plots = new Plottable.Components.Group();
    if (this.options.gridLines) plots.append(
      new Plottable.Components.Gridlines(this.xScale, this.yScale));

    for (let col = 1; col < this.data[0].length; col++) {
      let seriesName = this.data[0][col];
      let dataset = this.getDataset(col);
      let plot = this.getPlot(seriesName, dataset);
      plots.append(plot);
    }

    return plots;
  }

  getPlot(seriesName: string, dataset: Plottable.Dataset) {
    let plot = new Plottable.Plots.Line()
      .addDataset(dataset);

    plot.x((d) => d.x, this.xScale);
    plot.y((d) => d.y, this.yScale);

    plot.attr('stroke', this.sScale.scale(seriesName));
    plot.attr('stroke-width', this.options.lineWidth);
    return plot;
  }
}
