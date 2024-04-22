import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AmplitudeService } from '../services/amplitude.service'; // Import the AmplitudeService


@Component({
  selector: 'app-slider-images',
  templateUrl: './slider-images.component.html',
  standalone: true,
  styleUrls: ['./slider-images.component.scss']
})
export class SliderImagesComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private amplitudeService: AmplitudeService) { } // Inject the AmplitudeService


  @ViewChild('imageContainer') imageContainer!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('sliderImage') sliderImage!: ElementRef;
  @ViewChild('cercle') cercle!: ElementRef;

  imageSrc = 'assets/images/imagesPNG/image1VH.png';
  sliderValue = 'image1VH.png'; // Initial value

  circle: HTMLDivElement | null = null; // Variable pour stocker le cercle actuel

  ngOnInit() {

  }
  ngAfterViewInit() {

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


      // Faire une requête HTTP POST à l'URL du contrôleur avec un corps de requête
      fetch('http://localhost:3000/api/script/execute-modification-graph-amplitude-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listeDates : "2023-03-14 2023-03-15 2023-03-22 2023-03-26",
          outputPathPolygonFolder : "/Users/mathieu/Etudes/IDU4/S8/Projet_IDU/PROJ831_Image_Amplitude/frontend/src/assets/images/imagesTIF/",
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
      this.imageSrc = `assets/images/imagesPNG/image${value}VH.png`;
      this.sliderValue = `image${value}VH.png`; // Update sliderValue
    }
  }
}