import { Component, Input, HostListener } from '@angular/core'
import { CommonModule }                   from '@angular/common'
import { NgxChartsModule }                from '@swimlane/ngx-charts'
import { LineChartData }                  from '../core/models/LineChartData'
import { LegendPosition }                 from '@swimlane/ngx-charts'

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
  legendPosition: LegendPosition = LegendPosition.Right

  ngOnInit(): void {
    this.updateLegendPosition(window.innerWidth)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateLegendPosition(event.target.innerWidth)
  }

  updateLegendPosition(width: number): void {
    if (width <= 768) {
      this.legendPosition = LegendPosition.Below
    } else {
      this.legendPosition = LegendPosition.Right
    }
  }
}