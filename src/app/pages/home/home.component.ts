import { Component, OnInit }  from '@angular/core'
import { Observable, of }     from 'rxjs'
import { OlympicService }     from 'src/app/core/services/olympic.service'
import { CommonModule }       from '@angular/common'
import { PieChartComponent }  from 'src/app/pie-chart/pie-chart.component'
import { TitleCardComponent } from 'src/app/title-card/title-card.component'
import { DataCardComponent }  from 'src/app/data-card/data-card.component'
import { Participation }      from 'src/app/core/models/Participation'
import { Olympic }            from 'src/app/core/models/Olympic'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    PieChartComponent, 
    TitleCardComponent, 
    DataCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls  : ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$   : Observable<any>                   = of(null)
  public cardTitle   : string                            = 'Medals per country'
  public dataCards   : { name: string; value: number }[] = []
  public pieChartData: { name: string; value: number }[] = []
  public dataLoaded  : boolean                           = false

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(olympics => {
      this.processData(olympics)
      this.dataLoaded = true
    })
  }

  private processData(olympics: Olympic[]): void {
    const distinctYears = new Set<number>()
    olympics.forEach(country => {
      country.participations.forEach(
        (participation: Participation) => { distinctYears.add(participation.year) })
    })

    this.dataCards = [
      { name: 'Number of JOs',       value: distinctYears.size },
      { name: 'Number of Countries', value: olympics.length    },
    ]

    this.pieChartData = olympics.map(country => ({
      name : country.country,
      value: country.participations.reduce(
        (sum: number, p: { medalsCount: number }) => sum + p.medalsCount, 0)
    }))
  }
}
