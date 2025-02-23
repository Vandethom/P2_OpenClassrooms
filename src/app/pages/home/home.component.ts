import { Component, OnInit }  from '@angular/core' 
import { Observable }         from 'rxjs' 
import { OlympicService }     from 'src/app/core/services/olympic.service' 
import { CommonModule }       from '@angular/common' 
import { Router }             from '@angular/router'
import { PieChartComponent }  from 'src/app/pie-chart/pie-chart.component' 
import { TitleCardComponent } from 'src/app/title-card/title-card.component' 
import { DataCardComponent }  from 'src/app/data-card/data-card.component' 
import { Olympic }            from 'src/app/core/models/Olympic' 
import { Country }            from 'src/app/core/models/Country'
import { DataCard }           from 'src/app/core/models/DataCard'
import { PieChartData }       from 'src/app/core/models/PieChartData'
import { CardFactoryService } from 'src/app/core/services/card-factory.service'

@Component({
  selector  : 'app-home',
  standalone: true,
  imports   : [
    CommonModule, 
    PieChartComponent, 
    TitleCardComponent, 
    DataCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls  : ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$   : Observable<Olympic[] | null> = this.olympicService.getOlympics()
  public olympicsData: Country[]                    = []
  public dataCards   : DataCard[]                   = []
  public pieChartData: PieChartData[]               = []
  public dataLoaded  : boolean                      = false
  public cardTitle   : string                       = 'Medals per country'

  constructor(
    private router            : Router,
    private olympicService    : OlympicService,
    private cardFactoryService: CardFactoryService
  ) { }

  ngOnInit(): void {
    this.olympics$.subscribe(olympics => {
      if (olympics) {
        this.olympicsData = olympics
        this.dataCards = this.cardFactoryService.getDataCardsForHome(olympics)
        this.pieChartData = this.cardFactoryService.getPieChartData(olympics)
        this.dataLoaded = true
      }
    })
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate([`/detail/${countryId}`])
  }
}