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
    private router: Router,
    private olympicService: OlympicService
  ) { }

  ngOnInit(): void {
    this.olympics$.subscribe(olympics => {
      if (olympics) {
        this.olympicsData = olympics;
        this.dataCards = [
          { name: 'Number of JOs', value: this.olympicService.getNumberOfJos() },
          { name: 'Number of Countries', value: this.olympicService.getNumberOfCountries() }
        ];
        this.pieChartData = this.olympicsData.map(country => ({
          name: country.country,
          value: country.participations.reduce(
            (sum: number, participation: { medalsCount: number }) => sum + participation.medalsCount,
            0
          ),
          id: country.id
        }))
        this.dataLoaded = true;
      }
    });
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate([`/detail/${countryId}`]);
  }
}