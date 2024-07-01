import { Injectable, inject } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interface';
import { DirectionsApi } from '../api/directionsApi';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  private directionsApi = inject(DirectionsApi)

  get isMapReady() {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('Mapa no inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  createMarkesFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw Error('Mapa no inicializado');

    this.markers.forEach((marker) => marker.remove());
    const newMarkers = []

    for (const place of places) {
      const [lng, lat] = place.geometry.coordinates;
      const popup = new Popup()
        .setHTML(`
        <h6>$1 place.text }</h6>
        <span>$( place-place_name }</span>
        `);

        const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup ( popup)
        .addTo ( this.map );

      newMarkers.push(newMarker)
    }

    this.markers = newMarkers

    if ( places.length == 0) return
    //ajustando zoom
    const bounds = new LngLatBounds()

    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()))
    bounds.extend(userLocation)
    this.map.fitBounds(bounds,{
      padding: 200
    })
  }

  getRouteBetweenPoints(start: [number, number], end:[number, number]){
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
    .subscribe((res) => {
      this.drawPolyline(res.routes[0])
    })
  }

  private drawPolyline(route: Route){
    const coords = route.geometry.coordinates

    const bounds = new LngLatBounds()
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat])
    })

    this.map?.fitBounds(bounds, {
      padding: 200
    })

    //Polyline basado en la documentacion de mapbox
    const sourceData: AnySourceData ={
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties:{},
            geometry:{
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //limpiamos ruta previa
    if(this.map?.getLayer('RouteString')){
      this.map.removeLayer('RouteString')
      this.map.removeSource('RouteString')
    }

    this.map?.addSource('RouteString', sourceData)

    this.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout:{
        'line-cap':'round',
        "line-join":'round',
      },
      paint:{
        "line-color": 'black',
        "line-width": 3
      }
    })
  }
}
