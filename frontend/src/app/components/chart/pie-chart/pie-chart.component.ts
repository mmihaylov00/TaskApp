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
      plotOptions: {
        pie: {
          customScale: 1,
          donut: {
            size: '55%',
          },
        },
      },
      stroke: {
        width: 1,
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
      noData: {
        text: 'No data available',
        align: 'center',
        verticalAlign: 'middle',
      },
      dataLabels: {
        // enabled: true,
        // offsetX: 30,
        // style: {
        //   fontSize: '4px',
        //   fontFamily: 'Helvetica, Arial, sans-serif',
        //   fontWeight: 'bold',
        // },
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex];
        },
      },
      ...this.options,
    };
  }
}
