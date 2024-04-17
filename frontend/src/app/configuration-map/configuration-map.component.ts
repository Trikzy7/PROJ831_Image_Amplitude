import { Component } from '@angular/core';
import {InfosComponent} from "../infos/infos.component";
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-configuration-map',
  standalone: true,
    imports: [
        InfosComponent,
        MapComponent
    ],
  templateUrl: './configuration-map.component.html',
  styleUrl: './configuration-map.component.scss'
})
export class ConfigurationMapComponent {
    ngOnInit() {
        window.addEventListener('scroll', () => {
            let backToTopButton = document.getElementById('backToTop');
            if (window.pageYOffset > 100) { // Show backToTopButton after 100px
                backToTopButton!.style.display = "block";
            } else { // Hide backToTopButton
                backToTopButton!.style.display = "none";
            }
        });
    }
    scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}
