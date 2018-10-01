import { BaseChartOptions, SeriesScaleType } from './interface';
import * as Plottable from 'plottable';


export class BaseChart {
  el: HTMLElement;
  data: string | any[][];
  legend: Plottable.Components.Legend;
  options: BaseChartOptions;
  plots: Plottable.Components.Group | Plottable.Components.Table;
  resizeTimeout: number;
  sScale: SeriesScaleType;
  table: Plottable.Components.Table;
  title: Plottable.Components.TitleLabel;

  constructor(
      target: string | HTMLElement,
      data: any[][],
      options: any) {
    this.options = this.getOptions(options, data);
    this.el = this.getElement(target);
    this.data = data;
    this.title = this.getTitle();
    this.sScale = this.getSeriesScale();
    this.legend = this.getLegend();
  }

  getDefaultOptions() : BaseChartOptions {
    return {
      dateRegex: /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/,
      legend: true,
      legendAlignment: 'right',
      legendRowWidth: 1,
      numberRegex: /^[\s$]*[\-\d.,]+[\s%]*$/,
      numberFilterRegex: /[^\-\d.]/g,
      redrawRate: 15,
      title: null
    };
  }

  getOptions(options: any, _data: any[][]) {
    return {...this.getDefaultOptions(), ...options};
  }

  getElement(target: string | HTMLElement) {
    if (target instanceof HTMLElement) return target;
    return document.getElementById(target);
  }

  getTitle() : Plottable.Components.TitleLabel {
    return (this.options.title) ?
      new Plottable.Components.TitleLabel(this.options.title) : null;
  }

  getSeriesScale() {
    // TODO: Add a color setting that can customize the series scale.
    return new Plottable.Scales.Color();
  }

  getLegend() : Plottable.Components.Legend {
    if (this.options.legend && this.sScale) {
      return new Plottable.Components.Legend(this.sScale)
        .maxEntriesPerRow(this.options.legendRowWidth)
        .xAlignment(this.options.legendAlignment);
    }
    return null;
  }

  getTable() : Plottable.Components.Table {
    return new Plottable.Components.Table([
      [this.title],
      [this.legend],
      [this.plots]
    ]);
  }

  marshall(value: any, _row: number, _col: number) {
    return value;
  }

  toScaleType(value: any, scale: any) {
    if (scale instanceof Plottable.Scales.Linear) {
      if (typeof value === 'number') return value;
      let num = parseFloat(value.toString()
        .replace(this.options.numberFilterRegex, ''));
      return (isNaN(num)) ? undefined : num;
    }

    if (scale instanceof Plottable.Scales.Time) {
      if (value instanceof Date) return value;
      let matches = value.toString().match(this.options.dateRegex);
      return (matches.length > 3) ?
        new Date(+matches[3], +matches[1] - 1, +matches[2]) : undefined;
    }

    return value.toString();
  }

  render() {
    this.table.renderTo(this.el);

    window.addEventListener('resize', () => {
      if (this.resizeTimeout) return;
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = null;
        this.table.redraw();
      }, Math.round(1000 / this.options.redrawRate));
    });
  }
}
