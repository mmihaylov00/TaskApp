import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartOptions } from '../chart.component';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  @Input() options?: Partial<ChartOptions>;
  @Input() title: String;
  @Input() height: number = 240;

  finalOptions: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges) {
    if (!this.options) {
      return;
    }
    this.finalOptions = {
      chart: {
        type: 'donut',
        height: this.height,
      },
      legend: {
        position: 'bottom',
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9,
          },
        },
      },
      tooltip: {
        fillSeriesColor: false,
        theme: 'light',
        onDatasetHover: {
          highlightDataSeries: true,
        },
      },
      dataLabels: {
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex];
        },
      },
      ...this.options,
    };
  }
}
