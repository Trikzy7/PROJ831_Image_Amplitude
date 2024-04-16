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

    getListDatesImagesBetweenDates(polygon: string, dateStart: string, dateEnd: string) {
      /*
      * GOAL: Get the list of dates of images between two dates for a given polygon using API from Alaska Satellite Facility
      * -> RETURN: List of dates
      */

      const url = `https://api.daac.asf.alaska.edu/services/search/param?platform=Sentinel-1&processingLevel=GRD_HD&intersectsWith=${polygon}&start=${dateStart}&end=${dateEnd}&output=json`;

      return this.http.get(url).pipe(
        map((data: any) => {
          return data[0].map((infoImage: any) => {
            const dateTime = infoImage.processingDate;
            const date = dateTime.split('T')[0];
            return date;
          });
        })
      )
    }

    getNameZipFromPolygonAndDate(polygon: string, date: string) {
      /*
      * GOAL: Get the name of the zip file from a given polygon and date using API from Alaska Satellite Facility
      * -> RETURN: Name of the zip file
      */

      const dateEnd: Date = new Date(date);
      dateEnd.setDate(dateEnd.getDate() + 1);

      const url = `https://api.daac.asf.alaska.edu/services/search/param?platform=Sentinel-1&intersectsWith=${polygon}&processingLevel=GRD_HD&start=${date}&end=${dateEnd.toISOString().split('T')[0]}&output=json`;

      return this.http.get(url).pipe(
        map((data: any) => {
          return data[0][0].productName;
        })
      )
    }

}
