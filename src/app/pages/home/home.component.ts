import { Component, OnInit }  from '@angular/core' 
import { Observable }         from 'rxjs' 
import { OlympicService }     from 'src/app/core/services/olympic.service' 
import { CommonModule }       from '@angular/common' 
import { PieChartComponent }  from 'src/app/pie-chart/pie-chart.component' 
import { TitleCardComponent } from 'src/app/title-card/title-card.component' 
import { DataCardComponent }  from 'src/app/data-card/data-card.component' 
import { Olympic }            from 'src/app/core/models/Olympic' 

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
  public olympics$   : Observable<Olympic[] | null>       = this.olympicService.getOlympics()
  public cardTitle   : string                             = 'Medals per country'
  public dataCards   : { name: string;  value: number }[] = []
  public pieChartData: { name: string;  value: number }[] = []
  public dataLoaded  : boolean                            = false

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$.subscribe(olympics => {
      if (olympics) {
        this.dataCards = [
          { name: 'Number of JOs', value: this.olympicService.getNumberOfJos() },
          { name: 'Number of Countries', value: this.olympicService.getNumberOfCountries() }
        ] 
        this.pieChartData = this.olympicService.getPieChartData() 
        this.dataLoaded = true 
      }
    }) 
  }
}