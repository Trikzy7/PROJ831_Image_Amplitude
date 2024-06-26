import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { formatDate, CommonModule } from '@angular/common';
import { PolygonService } from "../services/polygon.service";
import { Router } from "@angular/router";
import { Image } from '../models/image.model';
import { scriptService } from '../services/script.service';
import { ImageService } from '../services/image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-infos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {
  submit = false;
  noConform = false;
  startDate!: string;
  endDate!: string;
  polygon!: string;
  gptPath!: string;
  order: 'asc' | 'desc' = 'asc';
  listLocalImages!: Image[];
  isLoading = false;

  constructor(private polygonService: PolygonService,
    private router: Router,
    private scriptService: scriptService,
    private imageService: ImageService) { }

  onPolygonChange() {
    this.polygonService.setPolygon(this.polygon);
  }
  ngOnInit() {
    let today = new Date();
    this.startDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
    this.endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
    this.polygonService.polygon$.subscribe(polygon => {
      this.polygon = polygon;
    });
  }

  onSubmit(f: NgForm) {
    this.noConform = (f.value.gptPath == null || f.value.username == null || f.value.password == null || f.value.polygon == null) || (f.value.gptPath == "" || f.value.username == "" || f.value.password == "" || f.value.polygon == "");
    this.submit = true;

    if (!this.noConform) {

    // Afficher une boîte de dialogue de confirmation
    Swal.fire({
        title: 'Are you sure ?',
        text: "Do you really want to start the process ?",
        icon: 'warning',
        iconColor: '#7300ff',
        showCancelButton: true,
        confirmButtonColor: '#7300ff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

          // -- PROCESS CHECKING IF WE HAVE ALREADY ALL IMAGES IN LOCAL
          this.imageService.isTIFDirectoryExist(f.value.polygon)
            .subscribe((isTIFDirectoryExist) => {

              // -- CHECK IF DIRECTORY EXIST
              if (isTIFDirectoryExist.directoryExist) {
                console.log('Directory exist');

                //-- CHECK IF ALL IMAGES WANTED ARE PROCESSED
                //-- GET NUMBER OF IMAGES BETWEEN DATES IN ASF (true number of images)
                this.imageService.getListDatesImagesASFBetweenDates(f.value.polygon, this.startDate, this.endDate)
                  .subscribe((listDatesASFImages) => {
                    console.log(listDatesASFImages);

                    //-- GET LIST OF IMAGES BETWEEN DATES
                    this.imageService.getListImagesLocalBetweenDates(f.value.polygon, this.startDate, this.endDate)
                      .subscribe((listLocalImages) => {
                        console.log('prout 💨');
                        console.log(listLocalImages);

                        this.listLocalImages = listLocalImages;
                        console.log(this.listLocalImages);


                        //-- IF WE HAVE ALL IMAGES IN LOCAL
                        if (listDatesASFImages.length === listLocalImages.length) {
                          console.log('All images .tif are in local');
                            this.router.navigate(
                            ['/results'],
                            {
                              queryParams: {
                                polygon: f.value.polygon,
                                dateStart: this.startDate,
                                dateEnd: this.endDate
                              }
                            });
                        }
                        else {
                          // -- GET LIST OF DATES MISSING
                          let listDateImagesMissing = this.getListDateImagesMissing(listLocalImages, listDatesASFImages);
                          console.log(listDateImagesMissing);

                          //TODO EXECUTE SCRIPTS WITH LIST DATES MISSING
                          // TODO EXECUTE SCRIPTS WITH DATES START AND END
                            this.isLoading = true;
                          this.scriptService.executeAmplitudeScripts(f.value.polygon, f.value.username, f.value.password, this.startDate, this.endDate, f.value.gptPath, [])
                            .subscribe((data) => {
                              console.log(data);
                                this.isLoading = false;

                              this.router.navigate(
                                ['/results'],
                                {
                                  queryParams: {
                                    polygon: f.value.polygon,
                                    dateStart: this.startDate,
                                    dateEnd: this.endDate
                                  }
                                });
                            })

                        }
                      })
                  })
              }
              else {
                console.log('Directory does not exist');

                // TODO EXECUTE SCRIPTS WITH DATES START AND END
                  this.isLoading = true;
                this.scriptService.executeAmplitudeScripts(f.value.polygon, f.value.username, f.value.password, this.startDate, this.endDate, f.value.gptPath, [])
                  .subscribe((data) => {
                    console.log(data);
                      this.isLoading = false;

                    this.router.navigate(
                      ['/results'],
                      {
                        queryParams: {
                          polygon: f.value.polygon,
                          dateStart: this.startDate,
                          dateEnd: this.endDate
                        }
                      });
                  })

              }
            })
            }
        })
    }

  }

  getListDateImagesMissing(listLocalImages: Image[], listDatesASFImages: string[]) {
    /*
    * GOAL: Get the list of dates missing in local
    * -> RETURN: List of dates missing
    */

    let listDateLocalImage = listLocalImages.map(image => image.date)

    return listDatesASFImages.filter(date => !listDateLocalImage.includes(date));
  }


}


