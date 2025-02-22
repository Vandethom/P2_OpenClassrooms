import { Component, OnInit }     from '@angular/core';
import { filter, take, of }      from 'rxjs';
import { OlympicService }        from './core/services/olympic.service';
import { Router, NavigationEnd } from '@angular/router';
import { DataCard }              from './core/models/DataCard';
import { Participation }         from './core/models/Participation';
import { Olympic }               from './core/models/Olympic';
import { catchError }            from 'rxjs/operators';
import { CardFactoryService }    from './core/services/card-factory.service';

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
  participation: Participation | undefined
  
  constructor(
    private router            : Router, 
    private olympicService    : OlympicService,
    private cardFactoryService: CardFactoryService
  ) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(
      take(1),
      catchError((error: string, caught: any) => {
        console.error(error);
        this.error = error;
        this.olympicService.setOlympicsData(null)
        return of(null)
      })
    ).subscribe((olympics) => {
      this.updateCardTitle()
      if (olympics) {
        this.updateDataCards(olympics)
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCardTitle()
      this.olympicService.getOlympics().pipe(take(1)).subscribe(olympics => {
        if (olympics) {
          this.updateDataCards(olympics)
        }
      })
    })
  }

  private updateCardTitle(): void {
    if (this.router.url === '/') {
      this.cardTitle = 'Medals per country'
    } else {
      this.cardTitle = 'Name of the country'
    }
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