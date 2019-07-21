import { Component,Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {

  @Input() doughnutChartLabels: Label[];
  @Input() doughnutChartData;
  @Input() doughnutChartType: ChartType;
  @Input() colors;
  
  
  
  constructor() { }

  ngOnInit() {
  }

}
