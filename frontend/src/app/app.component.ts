import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageService } from './services/image.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
  }
}

