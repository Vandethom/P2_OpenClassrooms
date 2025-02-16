import { Component, OnInit, Input } from '@angular/core'
import { NgxChartsModule }          from '@swimlane/ngx-charts'
import { HttpClient }               from '@angular/common/http'
import { Router }                   from '@angular/router'
import { CommonModule }             from '@angular/common'
import { Country }                  from '../core/models/Country'
import { Participation }            from '../core/models/Participation'

@Component({
  selector   : 'app-pie-chart',
  standalone : true,
  imports    : [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './pie-chart.component.html',
  styleUrl   : './pie-chart.component.scss'
})

export class PieChartComponent implements OnInit {
  @Input() data    : { name: string; value: number }[] = []
  olympicsData     : Country[]                         = []
  pieChartData     : { name: string, value: number }[] = []
  totalOlympicGames: number                            = 0
  totalCountries   : number                            = 0

  constructor(private http: HttpClient,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>('assets/mock/olympic.json').subscribe(data => {
      this.olympicsData = data
      this.prepareChartData()
      this.calculateTotals()
    })
  }

  prepareChartData(): void {
    this.pieChartData = this.olympicsData.map(country => ({
      name : country.country,
      value: country.participations.reduce((
        sum          : number, 
        participation: Participation
      ) => sum + participation.medalsCount, 0)
    }))
  }
  
  calculateTotals(): void {
    const olympicGamesSet = new Set<number>();
    this.olympicsData.forEach(country => {
      country.participations.forEach(participation => {
        olympicGamesSet.add(participation.id)
      })
    })
    this.totalOlympicGames = olympicGamesSet.size
    this.totalCountries    = this.olympicsData.length
  }

  onSelect(event: any): void {
    const selectedCountry = this.olympicsData.find(
      country => country.country === event.name
    )
    if (selectedCountry) {
      this.router.navigate(['/detail', selectedCountry.id])
    }
  }
}
