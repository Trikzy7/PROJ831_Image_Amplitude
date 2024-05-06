import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AmplitudeService } from '../services/amplitude.service';
import {PolygonService} from "../services/polygon.service"; // Import the AmplitudeService
import { ActivatedRoute } from '@angular/router';
import {ImageService} from "../services/image.service";
import { Image } from '../models/image.model';
import * as fs from 'fs';

import * as postcss from 'postcss';


@Component({
  selector: 'app-slider-images',
  templateUrl: './slider-images.component.html',
  standalone: true,
  styleUrls: ['./slider-images.component.scss']
})
export class SliderImagesComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private amplitudeService: AmplitudeService,
              private imageService: ImageService,
              private route: ActivatedRoute) { } // Inject the AmplitudeService


  @ViewChild('imageContainer') imageContainer!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('sliderImage') sliderImage!: ElementRef;
  @ViewChild('cercle') cercle!: ElementRef;
  @ViewChild('Titre') titre!: ElementRef;

  imageSrc = '';
  sliderValue = 'image1V.png'; // Initial value
  maxSliderValue = 0;

  polygonFinal = '';
  listDates: string[] = [];
  listImages: Image[] = [];
  start: string | undefined = '';
  end: string | undefined = '';

  circle: HTMLDivElement | null = null; // Variable pour stocker le cercle actuel

  listeFinalImages !: Image[];
  listeFinalDates ! : string[];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let polygon = params.get('polygon')?.toString();
      let dateStart = params.get('dateStart')?.toString();
      this.start = dateStart;
      let dateEnd = params.get('dateEnd')?.toString();
      this.end = dateEnd;
      if (polygon && dateStart && dateEnd) {
        this.imageService.getListDatesImagesASFBetweenDates(polygon, dateStart, dateEnd)
            .subscribe((data) => {
              this.listDates = data;
              this.listDates.reverse(); // Inverse l'ordre de la liste
            });
        this.imageService.getListImagesLocalBetweenDates(polygon, dateStart, dateEnd)
            .subscribe((data) => {
              this.listImages = data;
            });
        console.log(this.listDates);
        console.log(this.listImages);





        polygon = polygon.replace(/ /g, "_").toLowerCase();
        console.log(polygon);

        this.maxSliderValue = this.listDates.length - 1;
        this.imageSrc = `../../assets/imagesTIF/${polygon}/png/${this.listImages[0].name.toString().replace('.tif', '_VV.png')}`;


        this.polygonFinal = polygon;


        let img = document.createElement('img');
        img.onload = () => {
          console.log('Largeur de l\'image :', img.width);
          console.log('Hauteur de l\'image :', img.height);
        };
        img.src = this.imageSrc; // Utilisez l'URL de l'image que vous avez déjà définie


        this.listeFinalImages = [];
        this.listeFinalDates = [];


        // Step 1: Calculate the average width and height
        let totalWidth = 0;
        let totalHeight = 0;
        this.listImages.forEach(image => {
          let img = document.createElement('img');
          img.src = `../../assets/imagesTIF/${polygon}/png/${image.name.toString().replace('.tif', '_VV.png')}`;
          img.onload = () => {
            totalWidth += img.width;
            totalHeight += img.height;

            console.log('Image :', img.width, img.height)
            // regarder si la largeur ou la hauteur de l'image actuelle est inférieur à l'image d'avant ou après dans la liste s'il y en a
            if (this.listImages.length > 0) {
              let previousImage = this.listImages[this.listImages.length - 1];
              let img2 = document.createElement('img');
              img2.src = `../../assets/imagesTIF/${polygon}/png/${previousImage.name.toString().replace('.tif', '_VV.png')}`;
              console.log('Image 2 :', img2.width, img2.height)
              if (img.width >= img2.width && img.height >= img2.height) {
                this.listeFinalImages.push(image);

                // rajouter la date dans la liste de date
                this.listeFinalDates.push(this.listDates[this.listImages.indexOf(image)]);

                // remplacer l'extension .tif par .png directement dans l'extension du fichier

              }
            }

            console.log(this.listeFinalImages)
            console.log(this.listeFinalDates)

            this.maxSliderValue = this.listeFinalDates.length - 1;
            this.imageSrc = `../../assets/imagesTIF/${polygon}/png/${this.listeFinalImages[0].name.toString().replace('.tif', '_VV.png')}`;

          };
        });


      }
    });
  }
  ngAfterViewInit() {
    this.titre.nativeElement.innerHTML = "Change in radar signal amplitude between " + this.start + " and " + this.end;

    this.imageContainer.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const rect = this.imageContainer.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const widthRatio = this.sliderImage.nativeElement.naturalWidth / this.sliderImage.nativeElement.width;
      const heightRatio = this.sliderImage.nativeElement.naturalHeight / this.sliderImage.nativeElement.height;
      const adjustedX = Math.round(x * widthRatio);
      const adjustedY = Math.round(y * heightRatio);
      console.log('Clic détecté aux coordonnées : X = ' + adjustedX + ', Y = ' + adjustedY);

      // Supprimer l'ancien cercle s'il existe
      if (this.circle) {
        this.circle.remove();
      }

      // Créer un nouveau cercle
      this.circle = document.createElement('div');
      this.circle.style.width = '20px'; // Diamètre du cercle
      this.circle.style.height = '20px'; // Diamètre du cercle
      this.circle.style.border = '3px solid red'; // Bordure du cercle
      this.circle.style.borderRadius = '50%'; // Pour rendre le div rond
      this.circle.style.position = 'absolute'; // Pour positionner le cercle
      this.circle.style.left = `${event.clientX + window.scrollX  - 10}px`; // Position X (moins la moitié du diamètre pour centrer)
      this.circle.style.top = `${event.clientY + window.scrollY  - 10}px`; // Position Y (moins la moitié du diamètre pour centrer)
      this.circle.style.zIndex = '9999'; // Pour que le cercle apparaisse au-dessus de tout le reste

      // Ajouter le cercle à l'image
      document.body.appendChild(this.circle);

      let stringDates = this.listDates.join(' ');


      // Faire une requête HTTP POST à l'URL du contrôleur avec un corps de requête
      fetch('http://localhost:3000/api/script/execute-modification-graph-amplitude-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listeDates : stringDates,
          polygon : this.polygonFinal,
          coordinates : adjustedX + " " + adjustedY
        })
      })
      .then(response => response.text())
      .then(data => {
        this.amplitudeService.updateAmplitudeData();
      });
    });
  }

  ngOnDestroy() {
    // Remove the circle when the component is destroyed
    if (this.circle) {
      this.circle.remove();
    }
  }

  changeImage(e: EventTarget | null) {
    if (e) {
      const target = e as HTMLInputElement;
      const value = target.value;

      this.imageSrc = `../../assets/imagesTIF/${this.polygonFinal}/png/${this.listeFinalImages[parseInt(value)].name.toString().replace('.tif', '_VV.png')}`;
      this.sliderValue = `image${value}VH.png`; // Update sliderValue
    }
  }
}