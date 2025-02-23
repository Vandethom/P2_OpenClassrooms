import { Component, OnInit }     from '@angular/core'
import { filter, take, of }      from 'rxjs'
import { OlympicService }        from './core/services/olympic.service'
import { Router, NavigationEnd } from '@angular/router'
import { DataCard }              from './core/models/DataCard'
import { Olympic }               from './core/models/Olympic'
import { catchError }            from 'rxjs/operators'
import { CardFactoryService }    from './core/services/card-factory.service'

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showDetail   : boolean    = false
  cardTitle    : string     = 'Medals per country'
  dataCards    : DataCard[] = []
  error        : string     = ''
  
  constructor(
    private router            : Router, 
    private olympicService    : OlympicService,
    private cardFactoryService: CardFactoryService
  ) {}

  ngOnInit(): void {
    this.loadOlympicData()

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadOlympicData()
    })
  }

  private loadOlympicData(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe(
      (olympics) => {
        if (olympics) {
          this.updateDataCards(olympics);
        }
      },
      (error) => {
        console.error(error);
        this.error = 'Failed to load Olympic data'
        this.olympicService.setOlympicsData(null)
      }
    )
  }

  private updateDataCards(olympics: Olympic[]): void {
    if (this.router.url === '/') {
      this.dataCards = this.cardFactoryService.getDataCardsForHome(olympics)
    } else if (this.router.url.includes('/detail')) {
      const countryId = parseInt(this.router.url.split('/')[2], 10)
      this.dataCards  = this.cardFactoryService.getDataCardsForDetail(olympics, countryId)
    } else {
      this.dataCards  = []
    }
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate([`/detail/${countryId}`])
  }
}
