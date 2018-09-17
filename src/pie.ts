import { BaseChart } from './base';
import { PieChartOptions } from './interface';
import * as Plottable from 'plottable';


export class PieChart extends BaseChart {
  options: PieChartOptions;
  vScale: Plottable.Scales.Linear;

  constructor(
      target: string | HTMLElement,
      data: any[][],
      options: any) {
    super(target, data, options);
    this.vScale = new Plottable.Scales.Linear();
    this.plots = this.getPlots();
    this.table = this.getTable();
    this.render();
  }

  getDefaultOptions() : PieChartOptions {
    return {
      ...super.getDefaultOptions(),
      innerRadius: 0,
      labels: true,
      outerRadius: 0
    };
  }

  getDataset(col: number) : Plottable.Dataset {
    let data = [];
    for (let row = 1; row < this.data.length; row++) {
      data.push({
        label: this.toScaleType(this.data[row][0], this.sScale),
        value: this.toScaleType(this.data[row][col], this.vScale)
      });
    }
    return new Plottable.Dataset(data);
  }

  getPlots() : Plottable.Components.Table {
    let labels = [];
    let plots = [];

    for (let col = 1; col < this.data[0].length; col++) {
      labels.push(new Plottable.Components.Label(this.data[0][col]));
      let dataset = this.getDataset(col);
      let plot = new Plottable.Plots.Pie()
        .addDataset(dataset)
        .sectorValue((d) => d.value)
        .attr('fill', (d) => d.label, this.sScale)
        .labelsEnabled(this.options.labels);

      if (this.options.innerRadius) plot.innerRadius(this.options.innerRadius);
      if (this.options.outerRadius) plot.outerRadius(this.options.outerRadius);
      plots.push(plot);
    }

    return new Plottable.Components.Table(
      (plots.length > 1) ? [labels, plots] : [plots]);
  }
}
