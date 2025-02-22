import { Component, OnInit }     from '@angular/core';
import { filter, take, of }          from 'rxjs';
import { OlympicService }        from './core/services/olympic.service';
import { Router, NavigationEnd } from '@angular/router';
import { DataCard }              from './core/models/DataCard';
import { Participation }         from './core/models/Participation';
import { Olympic }               from './core/models/Olympic';
import { catchError }            from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showDetail   : boolean    = false
  cardTitle    : string     = 'Medals per country'
  dataCards    : DataCard[] = []
  error        : string     = ''
  participation: Participation | undefined
  
  constructor(
    private router        : Router, 
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(
      take(1),
      catchError((error: string, caught: any) => {
        console.error(error);
        this.error = error;
        this.olympicService.setOlympicsData(null);
        return of(null)
      })
    ).subscribe((olympics) => {
      this.updateCardTitle();
      if (olympics) {
        this.updateDataCards(olympics);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCardTitle();
      this.olympicService.getOlympics().pipe(take(1)).subscribe(olympics => {
        if (olympics) {
          this.updateDataCards(olympics);
        }
      });
    });
  }

  private updateCardTitle(): void {
    if (this.router.url === '/') {
      this.cardTitle = 'Medals per country';
    } else {
      this.cardTitle = 'Name of the country';
    }
  }

  private updateDataCards(olympics: Olympic[]): void {
    if (this.router.url === '/') {
      this.updateDataCardsForHome(olympics);
    } else if (this.router.url.includes('/detail')) {
      this.updateDataCardsForDetail(olympics);
    } else {
      this.dataCards = [];
    }
  }

  private updateDataCardsForHome(olympics: Olympic[]): void {
    const distinctYears = new Set<number>();
    olympics.forEach(country => {
      country.participations.forEach((participation: Participation) => {
        distinctYears.add(participation.year);
      });
    });

    this.dataCards = [
      { name: 'Number of JOs', value: distinctYears.size },
      { name: 'Number of Countries', value: olympics.length }
    ];
  }

  private updateDataCardsForDetail(olympics: Olympic[]): void {
    const countryId       = parseInt(this.router.url.split('/')[2], 10);
    const selectedCountry = olympics.find(country => country.id === countryId);
    
    if (selectedCountry) {
      const totalEntries  = selectedCountry.participations.length;
      let totalAthletes   = 0;
      let totalMedals     = 0;
  
      selectedCountry.participations.forEach((participation: Participation) => {
        totalMedals += participation.medalsCount;
        totalAthletes += participation.athleteCount;
      });
  
      this.dataCards = [
        { name: 'Number of entries', value: totalEntries },
        { name: 'Total Number of medals', value: totalMedals },
        { name: 'Total number of athletes', value: totalAthletes } 
      ];
    } else {
      this.dataCards = [];
    }
  }

  onBack(): void {
    this.router.navigate(['/']);
  }
}