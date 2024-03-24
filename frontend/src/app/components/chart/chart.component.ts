import { Component, Input } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexStates,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  states: ApexStates;
  plotOptions: ApexPlotOptions;
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
