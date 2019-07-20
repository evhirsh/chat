import { Component, OnInit } from '@angular/core';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales','1','5','5','5','55','55','5555','jj','hhh'];
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100,50,88,44,55,88,66,55,5,8]
  ];
  public doughnutChartType: ChartType = 'doughnut';



  constructor() { }

  ngOnInit() {
  }

}
