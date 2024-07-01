import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { PlacesService } from '../../services';
import mapboxgl, { Marker, Popup } from 'mapbox-gl';

@Component({
  selector: 'maps-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent {

  private placesServices = inject(PlacesService)

  @ViewChild('mapDiv') mapDivElement!: ElementRef
  ngAfterViewInit(): void {
    if(!this.placesServices.userLocation) throw Error('No hay placesService')
    const map = new mapboxgl.Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesServices.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const popup = new Popup()
    .setHTML(
      `
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `
    )

    const marker = new Marker({color: 'red'})
    .setLngLat(this.placesServices.userLocation)
    .setPopup(popup)
    .addTo(map)
  }
}
