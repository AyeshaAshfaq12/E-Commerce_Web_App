import { Component} from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent {
title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      '28-11-2002',
      '28-11-2002',
      '28-11-2002',
      '28-11-2002',
      '28-11-2002',
      '28-11-2002',
      '28-11-2002',
    ],
    datasets: [
      {
        data: [ 65, 559, 1000, 81, 556, 55, 40, ],
        // label: 'Series A',
        fill: true,
        tension: 0.5,

        borderColor: '#4b6bdd',
        backgroundColor: '#a3edfa'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  constructor() {
  }

  ngOnInit() {
  }
}
