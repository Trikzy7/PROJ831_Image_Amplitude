import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-slider-images',
  templateUrl: './slider-images.component.html',
  standalone: true,
  styleUrls: ['./slider-images.component.scss']
})
export class SliderImagesComponent implements OnInit, AfterViewInit {
  @ViewChild('imageContainer') imageContainer!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('sliderImage') sliderImage!: ElementRef;

  imageSrc = 'assets/images/imagesPNG/image1VH.png';
  sliderValue = 'image1VH.png'; // Initial value

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
      alert('Clic détecté aux coordonnées : X = ' + adjustedX + ', Y = ' + adjustedY);
    });
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