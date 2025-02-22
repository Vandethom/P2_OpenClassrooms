import { Component, Input } from '@angular/core'
import { CommonModule }     from '@angular/common'
import { NgxChartsModule }  from '@swimlane/ngx-charts'
import { LineChartData }    from '../core/models/LineChartData'

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
  @Input() data: LineChartData[] = []
}