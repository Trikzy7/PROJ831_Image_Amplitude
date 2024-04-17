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

}
