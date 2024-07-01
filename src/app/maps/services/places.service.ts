import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Feature, Places } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private http = inject(HttpClient)

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
    this.isLoadingPlaces = true;
    this.http.get<Places>(`https://api.mapbox.com/search/geocode/v6/forward?q=${query}&limit=5&proximity=-75.61083132312234%2C6.152481226491631&language=es&access_token=pk.eyJ1IjoianNmYzIxOTkiLCJhIjoiY2x4eGtnczd4MmVuazJpcHRzdXdqcmh3ZSJ9.1ojpSPj3K7ubSwUr7rgeAw`)
      .subscribe(res => {
        this.isLoadingPlaces = false;
        this.places = res.features

      })
  }
}
