import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChatService } from '../chat.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  isLogin;
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData=[];
  public doughnutChartLabels1: Label[] = [];
  public doughnutChartData1=[];
  public doughnutChartType: ChartType = 'doughnut';
  public colors=
    [{
      backgroundColor:[]
    }];
  public colors1=
    [{
      backgroundColor:[]
    }];

  httpOptions;

  constructor(private chatService:ChatService,private router:Router) {}

  ngOnInit() {
  this.isLogin = localStorage.getItem('jwtToken') ? true:false;

    if (this.isLogin) {
      this.httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken'),'Content-Type':'application/json','Cache-Control': 'no-cache' })
      };
    this.chatService.getMyStaticsPerGroupByMessages(this.httpOptions).then(data =>{
      data.forEach(element => {
        this.doughnutChartData.push(element.messagesCount);
        this.doughnutChartLabels.push((element._id.Gname));
        this.colors[0].backgroundColor.push(this.getColor())
      });
    }).catch(err => {return})
    
    this.chatService.getGroupsStatics(this.httpOptions).then(data =>{
      data.forEach(element => {
        this.doughnutChartData1.push(element.messagesCount);
        this.doughnutChartLabels1.push((element._id.Gname));
        this.colors1[0].backgroundColor.push(this.getColor())
      });
    }).catch(err => {return})
    }else{
      this.router.navigate(['login']);
    }
    
  }

  getColor() {
    return ( '#' + Math.random().toString(16).slice(2,8));
  }

}
