import { HttpClient }                      from '@angular/common/http'
import { Injectable }                      from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, tap, map }            from 'rxjs/operators'
import { Olympic }                         from '../models/Olympic'
import { Participation }                   from '../models/Participation'
import { Country }                         from '../models/Country'

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string    = './assets/mock/olympic.json'
  private olympics$             = new BehaviorSubject<Olympic[] | null>(null)
  private olympics  : Olympic[] = []

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((olympics) => {
        this.olympics = olympics
        this.olympics$.next(olympics)
      }),
      catchError((error, caught) => {
        console.error(error)
        this.setOlympicsData(null)

        return of([])
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable()
  }

  setOlympicsData(olympics: Olympic[] | null): void {
    this.olympics$.next(olympics)
  }

  getNumberOfJos(): number {
    const distinctYears = new Set<number>()
    this.olympics.forEach((country) => {
      country.participations.forEach((participation: Participation) => {
        distinctYears.add(participation.year)
      })
    })
    return distinctYears.size
  }

  getNumberOfCountries(): number {
    return this.olympics.length
  }
  
  getCountryById(countryId: number): Observable<Country | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map((countries) => countries.find((country) => country.id === countryId)),
      catchError((error, caught) => {
        console.error(error)
        return of(undefined)
      })
    )
  }
}