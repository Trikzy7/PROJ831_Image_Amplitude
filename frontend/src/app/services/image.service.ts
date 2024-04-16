import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


    getNbImagesBetweenDates(polygon: string, dateStart: string, dateEnd: string) {
        /*
        * GOAL: Get the number of images between two dates for a given polygon using API from Alaska Satellite Facility
        * -> RETURN: Number of images
        */

      const url = `https://api.daac.asf.alaska.edu/services/search/param?platform=Sentinel-1&processingLevel=GRD_HD&intersectsWith=${polygon}&start=${dateStart}&end=${dateEnd}&output=json`;

      return this.http.get(url).pipe(
        map((data: any) => {
          return data[0].length;
        })
      )  
    }

}
