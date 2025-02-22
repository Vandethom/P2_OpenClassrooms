import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { LineChartComponent }        from 'src/app/line-chart/line-chart.component';
import { TitleCardComponent }        from 'src/app/title-card/title-card.component';
import { DataCardComponent }         from 'src/app/data-card/data-card.component';
import { ActivatedRoute, Router }    from '@angular/router';
import { OlympicService }            from 'src/app/core/services/olympic.service';
import { Country }                   from 'src/app/core/models/Country';
import { Participation }             from 'src/app/core/models/Participation';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule, 
    LineChartComponent, 
    TitleCardComponent, 
    DataCardComponent
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public cardTitle    : string                            = 'Name of the country';
  public dataCards    : { name: string; value: number }[] = [];
  public dataLoaded   : boolean                           = false;
  private countryId   : number | null                     = null;
  public lineChartData: { name: string, series: { 
    name: string, value: number }[] }[]                   = [];
  
  @Output() back: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private route          : ActivatedRoute, 
    private olympicService : OlympicService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.countryId = +params.get('id')!;
      this.loadCountryData();
    });
  }

  private loadCountryData(): void {
    if (this.countryId !== null) {
      this.olympicService.getCountryById(this.countryId).subscribe(country => {
        if (country) {
          this.cardTitle = country.country;
          this.dataCards = [
            { name: 'Number of entries', value: country.participations.length },
            { name: 'Total Medals',      value: country.participations.reduce((sum: number, participation: Participation) => sum + participation.medalsCount,  0) },
            { name: 'Total Athletes',    value: country.participations.reduce((sum: number, participation: Participation) => sum + participation.athleteCount, 0) }
          ];
          this.lineChartData = [
            {
              name   : 'Medals',
              series : country.participations.map((participation: Participation) => ({
                name : participation.year.toString(),
                value: participation.medalsCount
              }))
            },
            {
              name   : 'Athletes',
              series : country.participations.map((participation: Participation) => ({
                name : participation.year.toString(),
                value: participation.athleteCount
              }))
            }
          ];
          this.dataLoaded = true;
        }
      });
    }
  }

  goBack(): void {
    this.back.emit();
  }
}