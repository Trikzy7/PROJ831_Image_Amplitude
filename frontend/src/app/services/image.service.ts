import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}


    // getNbImagesASFBetweenDates(polygon: string, dateStart: string, dateEnd: string) {
    //     /*
    //     * GOAL: Get the number of images between two dates for a given polygon using API from Alaska Satellite Facility
    //     * -> RETURN: Number of images
    //     */

    //   const url = `https://api.daac.asf.alaska.edu/services/search/param?platform=Sentinel-1&processingLevel=GRD_HD&intersectsWith=${polygon}&start=${dateStart}&end=${dateEnd}&output=json`;

    //   return this.http.get(url).pipe(
    //     map((data: any) => {
    //       return data[0].length;
    //     })
    //   )  
    // }

    getListDatesImagesASFBetweenDates(polygon: string, dateStart: string, dateEnd: string) {
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
      
      const [year, month, day] = date.split('-').map(Number);
      const result = new Date(Date.UTC(year, month - 1, day + 1));
      let dateEnd =  result.toISOString().split('T')[0];
      
      const url = `https://api.daac.asf.alaska.edu/services/search/param?platform=Sentinel-1&intersectsWith=${polygon}&processingLevel=GRD_HD&start=${date}&end=${dateEnd}&output=json`;

      return this.http.get(url).pipe(
        map((data: any) => {
          console.log(data);
          
          return data[0][0].productName;
        })
      )
    }

    isTIFDirectoryExist(nameDirectory: string) {
      /*
      * GOAL: Check if a directory exists
      * -> RETURN: Boolean
      */

      nameDirectory = nameDirectory.replace(/\s/g, '_');

      return this.http.get(`http://localhost:3000/api/image/is-tif-directory-exist/${nameDirectory}`).pipe(
        map((data: any) => {
          return data;
        })
      )
    }

    isZIPFileAlreadyDownloaded(nameDirectory: string, nameFile: string) {
      /*
      * GOAL: Check if a .zip file is already downloaded
      * -> RETURN: Boolean
      */

      nameDirectory = nameDirectory.replace(/-/g, '_');

      return this.http.get(`http://localhost:3000/api/image/is-zip-file-already-downloaded/${nameDirectory}/${nameFile}.zip`).pipe(
        map((data: any) => {
          return data;
        })
      )
    }

    // getNbImagesLocalBetweenDates(polygon: string, dateStart: string, dateEnd: string) {
    //   /*
    //   * GOAL: get the number of images between two dates for a given polygon in local
    //   * -> RETURN: Boolean
    //   */

    //   polygon = polygon.replace(/\s/g, '_');

    //   return this.http.get(`http://localhost:3000/api/image/nb-local-images-between-dates`, 
    //   {
    //     params: {
    //       polygon: polygon,
    //       dateStart: dateStart,
    //       dateEnd: dateEnd
    //     }
    //   }).pipe(
    //     map((data: any) => {
    //       return data;
    //     })
    //   )
    // }

    getListImagesLocalBetweenDates(polygon: string, dateStart: string, dateEnd: string) {
      /*
      * GOAL: Get the list of images between two dates for a given polygon in local
      * -> RETURN: Boolean
      */

      polygon = polygon.replace(/\s/g, '_');

      return this.http.get(`http://localhost:3000/api/image/list-local-images-between-dates`, 
      {
        params: {
          polygon: polygon,
          dateStart: dateStart,
          dateEnd: dateEnd
        }
      }).pipe(
        map((data: any) => data.files.map((file: any) => new Image(file.name, file.date, file.absolutePath)))
      )
    }

}
