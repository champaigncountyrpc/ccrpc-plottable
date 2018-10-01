import * as Plottable from 'plottable';


export type Alignment = 'left' | 'center' | 'right';

export type AxisName = 'x' | 'y';

export type AxisPosition = 'bottom' | 'left' | 'right' | 'top';

export type AxisType = Plottable.Axes.Category
  | Plottable.Axes.Numeric
  | Plottable.Axes.Time;

export type AxisTypeOption = 'auto' | 'category' | 'numeric' | 'time';

export type AxisScaleType = Plottable.Scales.Category
  | Plottable.Scales.Linear
  | Plottable.Scales.Time;

export type SeriesScaleType = Plottable.Scales.Color;

export interface BaseChartOptions {
  dateRegex?: RegExp;
  legend?: boolean;
  legendAlignment?: Alignment;
  legendRowWidth?: number;
  numberRegex?: RegExp;
  numberFilterRegex?: RegExp;
  redrawRate?: number;
  title?: string;
}

export interface XYChartOptions extends BaseChartOptions {
  gridLines?: boolean;
  xAngle?: number;
  xLabel?: string;
  xType?: AxisTypeOption;
  yAngle?: number;
  yLabel?: string;
  yType?: AxisTypeOption;
}

export interface BarChartOptions extends XYChartOptions {
  stacked?: boolean;
  yType?: 'numeric';
}

export interface LineChartOptions extends XYChartOptions {
  lineWidth?: number;
  yType?: 'numeric';
}

export interface PieChartOptions extends BaseChartOptions {
  innerRadius?: number;
  labels?: boolean;
  outerRadius?: number;
}
