import { Component, OnInit }     from '@angular/core';
import { filter, take }          from 'rxjs';
import { OlympicService }        from './core/services/olympic.service';
import { Router, NavigationEnd } from '@angular/router';
import { DataCard }              from './core/models/DataCard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  cardTitle: string     = 'Medals per country';
  dataCards: DataCard[] = []
  
  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe(olympics => {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        if (this.router.url === '/') {
          this.cardTitle = 'Medals per country';
        } else {
          this.cardTitle = 'Name of the country';
        }
        this.updateDataCards(olympics); 
      });
      if (this.router.url === '/') {
        this.cardTitle = 'Medals per country';
      } else {
        this.cardTitle = 'Name of the country';
      }
      this.updateDataCards(olympics);
    });
  }

  private updateDataCards(olympics: any[]): void {
    if (this.router.url === '/') {
      this.dataCards = [
        // TODO : replace Mock data with actual data
        { name: 'Number of JOs'      , value: 3 },
        { name: 'Number of Countries', value: olympics.length }
      ];
    } else if (this.router.url.includes('/detail')) {
      this.dataCards = [
        // TODO : replace Mock data with actual data
        { name: 'Number of entries'       , value: 8 },
        { name: 'Total Number of medals'  , value: 8 },
        { name: 'Total number of athletes', value: 8 } 
      ];
    } else {
      this.dataCards = [];
    }
  }
}
