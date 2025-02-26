import { Component, OnInit, OnDestroy }     from '@angular/core'
import { filter, take, of, Subscription }   from 'rxjs'
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
  public  showDetail   : boolean    = false
  public  cardTitle    : string     = 'Medals per country'
  public  dataCards    : DataCard[] = []
  public  error        : string     = ''
  private olympicSubscription: Subscription | undefined = undefined
  private routerSubscription : Subscription | undefined = undefined

  constructor(
    private router            : Router, 
    private olympicService    : OlympicService,
    private cardFactoryService: CardFactoryService
  ) {}

  ngOnInit(): void {
    this.loadOlympicData()

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadOlympicData()
    })
  }

  ngOnDestroy(): void {
    if (this.olympicSubscription) {
      this.olympicSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadOlympicData(): void {
    this.olympicSubscription = this.olympicService.loadInitialData().pipe(take(1)).subscribe(
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
    } else if (this.router.url.includes('/s')) {
      const countryId = parseInt(this.router.url.split('/')[2], 10)
      this.dataCards  = this.cardFactoryService.getDataCardsForDetail(olympics, countryId)
    } else {
      this.dataCards  = []
    }
  }

  onCountrySelected(countryId: number): void {
    this.router.navigate([`/details/${countryId}`])
  }
}
