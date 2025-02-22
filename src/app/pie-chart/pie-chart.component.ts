import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxChartsModule }                                from '@swimlane/ngx-charts';
import { Router }                                         from '@angular/router';
import { CommonModule }                                   from '@angular/common';
import { Country }                                        from '../core/models/Country';
import { Participation }                                  from '../core/models/Participation';
import { OlympicService }                                 from '../core/services/olympic.service';

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
  @Input() data    : { name: string; value: number }[] = [];
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  olympicsData     : Country[]                         = [];
  pieChartData     : { name: string, value: number }[] = [];
  totalOlympicGames: number                            = 0;
  totalCountries   : number                            = 0;

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(olympics => {
      if (olympics) {
        this.olympicsData = olympics;
        this.prepareChartData();
        this.calculateTotals();
      }
    });
  }

  prepareChartData(): void {
    this.pieChartData = this.olympicsData.map(country => ({
      name : country.country,
      value: country.participations.reduce((sum: number, participation: Participation) => sum + participation.medalsCount, 0)
    }));
  }
  
  calculateTotals(): void {
    const olympicGamesSet = new Set<number>();
    this.olympicsData.forEach(country => {
      country.participations.forEach(participation => {
        olympicGamesSet.add(participation.year); // Changed to year to make sense
      });
    });
    this.totalOlympicGames = olympicGamesSet.size;
    this.totalCountries    = this.olympicsData.length;
  }

  onSelect(event: any): void {
    this.select.emit(event);
  }
}