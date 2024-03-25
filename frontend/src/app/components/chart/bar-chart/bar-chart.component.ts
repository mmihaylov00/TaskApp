import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartOptions } from '../chart.component';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  @Input() options?: Partial<ChartOptions>;
  @Input() title: String;
  @Input() height: number = 200;

  finalOptions: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges) {
    this.finalOptions = {
      chart: {
        type: 'bar',
        height: this.height,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: 'bottom',
      },
      fill: {
        opacity: 1,
      },
      ...this.options,
    };
  }
}
