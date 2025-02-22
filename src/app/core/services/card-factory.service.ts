import { Injectable }    from '@angular/core';
import { Olympic }       from '../models/Olympic';
import { Participation } from '../models/Participation';
import { DataCard }      from '../models/DataCard';

@Injectable({
  providedIn: 'root',
})
export class CardFactoryService {
  constructor() {}

  getDataCardsForHome(olympics: Olympic[]): DataCard[] {
    const distinctYears = new Set<number>()
    olympics.forEach((country) => {
      country.participations.forEach((participation: Participation) => {
        distinctYears.add(participation.year)
      })
    })

    return [
      { name: 'Number of JOs',       value: distinctYears.size },
      { name: 'Number of Countries', value: olympics.length },
    ]
  }

  getDataCardsForDetail(olympics: Olympic[], countryId: number): DataCard[] {
    const selectedCountry = olympics.find((country) => country.id === countryId)

    if (selectedCountry) {
      const totalEntries = selectedCountry.participations.length
      let totalAthletes  = 0
      let totalMedals    = 0

      selectedCountry.participations.forEach((participation: Participation) => {
        totalMedals   += participation.medalsCount
        totalAthletes += participation.athleteCount
      });

      return [
        { name: 'Number of entries',        value: totalEntries },
        { name: 'Total Number of medals',   value: totalMedals },
        { name: 'Total number of athletes', value: totalAthletes },
      ];
    } else {
      return []
    }
  }
}