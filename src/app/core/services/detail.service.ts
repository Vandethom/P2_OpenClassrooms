import { Injectable }      from '@angular/core'
import { HttpClient }      from '@angular/common/http'
import { Observable, of }  from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Country }         from '../models/Country'
import { DataCard }        from '../models/DataCard'
import { LineChartData }   from '../models/LineChartData'
import { Participation }   from '../models/Participation'

@Injectable()
export class DetailService {
  private olympicUrl: string = './assets/mock/olympic.json'

  constructor(private http: HttpClient) { }

  getCountryById(countryId: number): Observable<Country | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map((countries) => countries.find(
        (country) => country.id === countryId)
      ),
      catchError((error, caught) => {
        console.error(error)
        return of(undefined)
      })
    );
  }

  formatCountryData(country: Country): { dataCards: DataCard[], lineChartData: LineChartData[] } {
    const dataCards: DataCard[] = [
      { name: 'Number of entries', value: country.participations.length },
      { name: 'Total Medals', value: country.participations.reduce(
        (sum: number, participation: Participation) => sum + participation.medalsCount, 0) 
      },
      { name: 'Total Athletes', value: country.participations.reduce(
        (sum: number, participation: Participation) => sum + participation.athleteCount, 0) 
      }
    ]

    const lineChartData: LineChartData[] = [
      {
        name: 'Medals',
        series: country.participations.map((participation: Participation) => ({
          name : participation.year.toString(),
          value: participation.medalsCount
        }))
      },
      {
        name: 'Athletes',
        series: country.participations.map((participation: Participation) => ({
          name : participation.year.toString(),
          value: participation.athleteCount
        }))
      }
    ]

    return { dataCards, lineChartData }
  }
}