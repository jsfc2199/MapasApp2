import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor() {
    //para obtener la info tan pronto algún lugar use nuestro servicio
    this.getUserLocation()
   }

  public userLocation?: [number, number]= undefined

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
}
