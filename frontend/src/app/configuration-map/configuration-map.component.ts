import { Component } from '@angular/core';
import {InfosComponent} from "../infos/infos.component";
import {MapComponent} from "../map/map.component";
import {DashboardService} from "../services/dashboard.service";

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
    constructor(protected dashboardService: DashboardService) { }
    ngOnInit() {
        let backToTopButton = null;

        this.dashboardService.setIsOnDashboard(false);
        if (typeof document !== "undefined") {
            backToTopButton = document.getElementById('backToTop');
        }

        if (typeof window !== "undefined" && backToTopButton) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 100) { // Show backToTopButton after 100px
                    backToTopButton.style.display = "block";
                } else { // Hide backToTopButton
                    backToTopButton.style.display = "none";
                }
            });
        }
    }
    scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}
