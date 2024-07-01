//Custom http client

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class DirectionsApi extends HttpClient {

  public baseUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving'

  constructor(handler: HttpHandler){
    super(handler)
  }

  public override get<T>(url: string){
    url = this.baseUrl + url

    return super.get<T>(url, {
      params: {
        alternatives: false,
        geometries: 'geojson',
        language: 'es',
        overview: 'full',
        steps: true,
        access_token: environment.token,
      }
    })
  }
}
