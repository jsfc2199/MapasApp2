import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'maps-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent {

  private placesServices = inject(PlacesService)

}
