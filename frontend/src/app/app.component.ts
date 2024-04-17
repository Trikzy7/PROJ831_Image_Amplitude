import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageService } from './services/image.service';
import {InfosComponent} from "./infos/infos.component";
import {ConfigurationMapComponent} from "./configuration-map/configuration-map.component";
import {SliderImagesComponent} from "./slider-images/slider-images.component";
import {GraphAmplitudeComponent} from "./graph-amplitude/graph-amplitude.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InfosComponent, ConfigurationMapComponent, SliderImagesComponent, GraphAmplitudeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'satelite';

  constructor(private imageService: ImageService,) {}

  ngOnInit() {
    console.log('app component');

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

    this.imageService.getNameZipFromPolygonAndDate(
      'polygon((6.0502 45.7566,6.2397 45.7566,6.2397 45.9662,6.0502 45.9662,6.0502 45.7566))', 
      '2023-03-27'
      ).subscribe((data) => {
        console.log(data);
    })
  }
}

