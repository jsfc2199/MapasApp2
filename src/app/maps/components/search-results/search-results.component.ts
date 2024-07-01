import { Component, inject } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places.interface';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  private placesService = inject(PlacesService)
  private mapServices = inject(MapService)
  public selectedId: string = ''

  get isLadingPlaces (){
    return this.placesService.isLoadingPlaces
  }

  get places(){
    return this.placesService.places
  }

  flyTo(place:Feature){
    const[lng, lat] = place.geometry.coordinates
    this.mapServices.flyTo([lng, lat])
    this.selectedId = place.id
  }

  getDirections(place: Feature){
    const start = this.placesService.userLocation!
    const end = place.geometry.coordinates as [number, number]

    this.mapServices.getRouteBetweenPoints(start, end)
  }
}
