import { Injectable }      from '@angular/core'
import { HttpClient }      from '@angular/common/http'
import { Observable, of }  from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Country }         from '../models/Country'

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private olympicUrl: string = './assets/mock/olympic.json'

  constructor(private http: HttpClient) { }

  getCountryById(countryId: number): Observable<Country | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map((countries) => countries.find((country) => country.id === countryId)),
      catchError((error, caught) => {
        console.error(error)
        return of(undefined)
      })
    );
  }
}