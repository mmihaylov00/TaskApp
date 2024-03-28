import { Component, Input } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNoData,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  noData: ApexNoData;
  tooltip: ApexTooltip;
  states: ApexStates;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  labels: string[];
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-chart[options][title]',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() options: Partial<ChartOptions>;
  @Input() title: String;
}
