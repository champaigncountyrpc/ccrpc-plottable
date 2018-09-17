import { XYChart } from './xy';
import { BarChartOptions } from './interface';
import * as Plottable from 'plottable';


export class BarChart extends XYChart {
  options: BarChartOptions;
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

  getDefaultOptions() : BarChartOptions {
    return {
      ...super.getDefaultOptions(),
      stacked: false,
      yType: 'numeric'
    };
  }

  getPlots() : Plottable.Components.Group {
    let plots = new Plottable.Components.Group();
    let plot = (this.options.stacked) ?
      new Plottable.Plots.StackedBar() : new Plottable.Plots.ClusteredBar();

    if (this.options.gridLines) plots.append(
      new Plottable.Components.Gridlines(this.xScale, this.yScale));

    for (let col = 1; col < this.data[0].length; col++) {
      let seriesName = this.data[0][col];
      let dataset = this.getDataset(col);
      plot.addDataset(dataset.metadata(seriesName));
    }

    plot.x((d) => d.x, this.xScale);
    plot.y((d) => d.y, this.yScale);
    // TODO: Figure out why "as any" is necessary to make TypeScript
    // stop throwing errors about number of arguments.
    (plot as any).attr(
      'fill',
      (_d: any, _i: any , dataset: Plottable.Dataset) => dataset.metadata(),
      this.sScale);

    plots.append(plot);
    return plots;
  }
}
