import { Component, inject } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  private placesService = inject(PlacesService)
  private mapService = inject(MapService)

  goToMyLocation(){
    if(!this.placesService.isUserLocationReady) throw Error('No hay ubicación del usuario')
    if(!this.mapService.isMapReady) throw Error('No hay mapa cargado')

    this.mapService.flyTo(this.placesService.userLocation!)
  }
}
