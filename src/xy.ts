import { BaseChart } from './base';
import { XYChartOptions, AxisType, AxisScaleType, AxisTypeOption, AxisName,
  AxisPosition } from './interface';
import * as Plottable from 'plottable';


export class XYChart extends BaseChart {
  options: XYChartOptions;
  xAxis: AxisType;
  xLabel: Plottable.Components.AxisLabel;
  xScale: AxisScaleType;
  yAxis: AxisType;
  yLabel: Plottable.Components.AxisLabel;
  yScale: AxisScaleType;

  constructor(
      target: string | HTMLElement,
      data: any[][],
      options: any) {
    super(target, data, options);

    this.xScale = this.getAxisScale('x');
    this.yScale = this.getAxisScale('y');

    this.xAxis = this.getAxis('x');
    this.yAxis = this.getAxis('y');

    this.xLabel = this.getAxisLabel('x');
    this.yLabel = this.getAxisLabel('y');
  }

  getDefaultOptions() : XYChartOptions {
    return {
      ...super.getDefaultOptions(),
      gridLines: false,
      xAngle: 0,
      xLabel: null,
      xType: 'auto',
      yAngle: 0,
      yLabel: null,
      yType: 'auto'
    };
  }

  getOptions(options: any, data: any[][]) {
    let result = super.getOptions(options, data);

    if (result.xType === 'auto')
      result.xType = this.guessAxisType('x', result, data[1][0]);
    if (result.yType === 'auto')
      result.yType = this.guessAxisType('y', result, data[1][1]);

    return result;
  }

  getAxisScale(axis: AxisName) {
    let axisType = (axis === 'x') ? this.options.xType : this.options.yType;
    if (axisType === 'category') return new Plottable.Scales.Category();
    if (axisType === 'time') return new Plottable.Scales.Time();
    return new Plottable.Scales.Linear();
  }

  guessAxisType(axis: AxisName, options: XYChartOptions, value: any) :
      AxisTypeOption {
    if (typeof value !== 'string')
      return (value instanceof Date && axis === 'x') ? 'time' : 'numeric';

    if (axis === 'x' && options.dateRegex.test(value)) return 'time';
    if (options.numberRegex.test(value)) return 'numeric';
    return 'category';
  }

  getAxis(axis: AxisName) : AxisType {
    let scale = (axis === 'x') ? this.xScale : this.yScale;
    let position : AxisPosition = (axis === 'x') ? 'bottom' : 'left';

    let angle = (axis === 'x') ? this.options.xAngle : this.options.yAngle;
    if ([-90, 0, 90].indexOf(angle) === -1) angle = 0;

    if (scale instanceof Plottable.Scales.Category)
      return new Plottable.Axes.Category(scale, position)
        .tickLabelAngle(angle);
    if (scale instanceof Plottable.Scales.Time)
      return new Plottable.Axes.Time(scale, 'bottom');
    if (scale instanceof Plottable.Scales.Linear)
      return new Plottable.Axes.Numeric(scale, position);

    return null;
  }

  getAxisLabel(axis: AxisName) {
    let axisObj = (axis === 'x') ? this.xAxis : this.yAxis;
    let axisText = (axis === 'x') ? this.options.xLabel : this.options.yLabel;
    let rotation = (axis === 'x') ? 0 : -90;
    return (axisObj && axisText) ?
      new Plottable.Components.AxisLabel(axisText, rotation) : null;
  }

  getDataset(col: number) : Plottable.Dataset {
    let data = [];
    for (let row = 1; row < this.data.length; row++) {
      data.push({
        x: this.marshall(this.data[row][0], row, 0),
        y: this.marshall(this.data[row][col], row, col)
      });
    }
    return new Plottable.Dataset(data);
  }

  marshall(value: any, row: number, col: number) {
    if (row === 0) return value.toString();
    if (col === 0) return this.toScaleType(value, this.xScale);
    return this.toScaleType(value, this.yScale);
  }

  getTable() : Plottable.Components.Table {
    return new Plottable.Components.Table([
      [null, null, this.title],
      [null, null, this.legend],
      [this.yLabel, this.yAxis, this.plots],
      [null, null, this.xAxis],
      [null, null, this.xLabel]
    ]);
  }
}
