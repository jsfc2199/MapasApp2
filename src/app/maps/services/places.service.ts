import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feature, Places } from '../interfaces/places.interface';
import { PlacesApiClient } from '../api/placesApiClient';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private placesApi = inject(PlacesApiClient)
  private mapsService = inject(MapService)

  constructor() {
    //para obtener la info tan pronto algún lugar use nuestro servicio
    this.getUserLocation()
   }

  public userLocation?: [number, number]= undefined
  public isLoadingPlaces: boolean = false
  public places: Feature[] = []

  get isUserLocationReady(): boolean {
    return !!this.userLocation
  }

  async getUserLocation(): Promise<[number, number]>{
    //para convertir la geo localización en promesa hacemos lo siguiente
    //usamos longitud y latitud para usar mapbox

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation = [coords.longitude, coords.latitude]
          console.log(this.userLocation)
          resolve(this.userLocation)
        },
        (error) => {
          alert('No se pudo obtener la geo localización')
          console.log(error);
          reject()
        }
      )
    })
  }

  getPlacesByQuery(query: string = ''){
    if(query.length === 0){
      this.isLoadingPlaces = false;
      this.places = []
      return
    }

    this.isLoadingPlaces = true;
    this.placesApi.get<Places>(`?q=${query}`, {
      params: {
        proximity: this.userLocation!.join(',')
      }
    })
      .subscribe(res => {
        console.log(res)
        this.isLoadingPlaces = false;
        this.places = res.features
        this.mapsService.createMarkesFromPlaces(this.places, this.userLocation!)
      })
  }
}
