import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageService } from './services/image.service';
import {InfosComponent} from "./infos/infos.component";
import {ConfigurationMapComponent} from "./configuration-map/configuration-map.component";
import {SliderImagesComponent} from "./slider-images/slider-images.component";
import {GraphAmplitudeComponent} from "./graph-amplitude/graph-amplitude.component";
import {DashboardResultsComponent} from "./dashboard-results/dashboard-results.component";
import { Image } from './models/image.model';
import { scriptService } from './services/script.service';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, InfosComponent, ConfigurationMapComponent, SliderImagesComponent, GraphAmplitudeComponent, DashboardResultsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'satelite';
  polygonTest = 'polygon((6.0502 45.7566,6.2397 45.7566,6.2397 45.9662,6.0502 45.9662,6.0502 45.7566))';
  dateStart = '2023-03-13';
  dateEnd = '2023-03-27';
  pathGPT = "/Applications/snap/bin/gpt";

  listLocalImages!: Image[];

  constructor(
    private imageService: ImageService,
    private scriptService: scriptService) {}

  ngOnInit() {
    // console.log('app component');

    // this.imageService.getNbImagesBetweenDates(
    //   'polygon((6.0502 45.7566,6.2397 45.7566,6.2397 45.9662,6.0502 45.9662,6.0502 45.7566))', 
    //   '2023-03-01', 
    //   '2023-03-31'
    //   ).subscribe((data) => {
    //     console.log(data);
    //   })

    // this.imageService.getListDatesImagesBetweenDates(
    //   'polygon((6.0502 45.7566,6.2397 45.7566,6.2397 45.9662,6.0502 45.9662,6.0502 45.7566))', 
    //   '2023-03-01', 
    //   '2023-03-31'
    //   ).subscribe((data) => {
    //     console.log(data);
    //   })

    // this.imageService.getNameZipFromPolygonAndDate(
    //   'polygon((6.0502 45.7566,6.2397 45.7566,6.2397 45.9662,6.0502 45.9662,6.0502 45.7566))', 
    //   '2023-03-27'
    //   ).subscribe((data) => {
    //     console.log(data);
    // })




    // -- PROCESS CHECKING IF WE HAVE ALREADY ALL IMAGES IN LOCAL
    // this.imageService.isTIFDirectoryExist(this.polygonTest)
    //   .subscribe((isTIFDirectoryExist) => {

    //     // -- CHECK IF DIRECTORY EXIST        
    //     if (isTIFDirectoryExist.directoryExist) {
    //       console.log('Directory exist');

    //       // -- CHECK IF ALL IMAGES WANTED ARE PROCESSED
    //       // -- GET NUMBER OF IMAGES BETWEEN DATES IN ASF (true number of images)
    //       this.imageService.getListDatesImagesASFBetweenDates(this.polygonTest, this.dateStart, this.dateEnd)
    //         .subscribe((listDatesASFImages) => {
    //           console.log(listDatesASFImages);

    //           // -- GET LIST OF IMAGES BETWEEN DATES
    //           this.imageService.getListImagesLocalBetweenDates(this.polygonTest, this.dateStart, this.dateEnd)
    //             .subscribe((listLocalImages) => {
    //               console.log('prout 💨');
    //               // console.log(listDatesImages);

    //               this.listLocalImages = listLocalImages;
    //               console.log(this.listLocalImages);


    //               // -- IF WE HAVE ALL IMAGES IN LOCAL
    //               if (listDatesASFImages.length === listLocalImages.length) {
    //                 console.log('All images .tif are in local');
    //               }
    //               else {
    //                 // -- GET LIST OF DATES MISSING
    //                 let listDateImagesMissing = this.getListDateImagesMissing(listLocalImages, listDatesASFImages);
    //                 console.log(listDateImagesMissing);

    //                 // TODO EXECUTE SCRIPTS WITH LIST DATES MISSING 


    //                 // -- GET LIST OF .ZIP NAME FOR TIF MISSING
    //                 // listDateImagesMissing.forEach(date => {
    //                 //   // console.log(date);
                      
    //                 //   this.imageService.getNameZipFromPolygonAndDate(this.polygonTest, date)
    //                 //     .subscribe((nameZip) => {
    //                 //       console.log(nameZip);

    //                 //       // -- CHECK IF ZIP FILE IS ALREADY DOWNLOADED
    //                 //       this.imageService.isZIPFileAlreadyDownloaded(date, nameZip)
    //                 //         .subscribe((isZIPFileAlreadyDownloaded) => {
    //                 //           console.log(isZIPFileAlreadyDownloaded);

    //                 //           // -- IF ZIP FILE ALREADY DOWNLOADED
    //                 //           if (isZIPFileAlreadyDownloaded.fileAlreadyDownloaded) {
    //                 //             console.log('Zip file already downloaded');

    //                 //             // -- LAUNCH PROCESS TO OBTAIN .TIF FILE
    //                 //             this.scriptService.executeAmplitudeProcessAndConvertScript(
    //                 //               [isZIPFileAlreadyDownloaded.absolutePath], this.polygonTest, this.pathGPT
    //                 //             ).subscribe((data) => {
    //                 //               console.log(data);
    //                 //             })


    //                 //           }
    //                 //           else {
    //                 //             console.log('Zip file to download ');
    //                 //             console.log(date);
                                
    //                 //           }
    //                 //         })


    //                 //     })
    //                 // })
    //               }
    //             })

    //         })

    //     }
    //     else {
    //       console.log('Directory does not exist');

    //       // TODO EXECUTE SCRIPTS WITH DATES START AND END 
    //     }
    // })
  }


}
