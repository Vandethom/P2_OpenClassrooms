import { Component, 
         OnInit, 
         Input, 
         Output, 
         EventEmitter,
         HostListener }             from '@angular/core'
import { NgxChartsModule,DataItem } from '@swimlane/ngx-charts'
import { Router }                   from '@angular/router'
import { CommonModule }             from '@angular/common'
import { Country }                  from '../core/models/Country'
import { Participation }            from '../core/models/Participation'
import { OlympicService }           from '../core/services/olympic.service'
import { PieChartData }             from '../core/models/PieChartData'
import { LegendPosition }           from '@swimlane/ngx-charts'

@Component({
  selector   : 'app-pie-chart',
  standalone : true,
  imports    : [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './pie-chart.component.html',
  styleUrls  : ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {
  @Input()  data   : PieChartData[]       = []
  @Output() select : EventEmitter<number> = new EventEmitter<number>()
  legendPosition: LegendPosition = LegendPosition.Right

  constructor() { }

  ngOnInit(): void {
    this.updateLegendPosition(window.innerWidth);
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

  onSelect(event: DataItem): void {
    const selectedItem = this.data.find(item => item.name === event.name)
    if (selectedItem) {
      this.select.emit(selectedItem.id)
    }
  }
}