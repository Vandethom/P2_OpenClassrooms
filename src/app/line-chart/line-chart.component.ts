import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './line-chart.component.html',
  styleUrls  : ['./line-chart.component.scss']
})
export class LineChartComponent {
  @Input() data: { name: string, series: { name: string, value: number }[] }[] = [];
}