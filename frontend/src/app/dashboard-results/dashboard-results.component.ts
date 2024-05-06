import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../services/dashboard.service";
import {SliderImagesComponent} from "../slider-images/slider-images.component";
import {MapComponent} from "../map/map.component";
import {GraphAmplitudeComponent} from "../graph-amplitude/graph-amplitude.component";
import {Router, ActivatedRoute} from "@angular/router";
import { ImageService } from '../services/image.service';

@Component({
    selector: 'app-dashboard-results',
    templateUrl: './dashboard-results.component.html',
    standalone: true,
    imports: [
        SliderImagesComponent,
        MapComponent,
        GraphAmplitudeComponent
    ],
    styleUrls: ['./dashboard-results.component.scss']
})
export class DashboardResultsComponent implements OnInit {

    buttonImage: string = "assets/Back_Arrow.svg";
    polygon !: string;
    startDate!: string;
    endDate!: string;
    listDateASFImages!: string[];

    constructor(
        protected dashboardService: DashboardService, 
        private router: Router,
        private route: ActivatedRoute,
        private imageService: ImageService,
        ) { }

    ngOnInit(): void {
        this.dashboardService.setIsOnDashboard(true);
        console.log("----- DashboardResultsComponent");
        
        this.polygon = this.route.snapshot.queryParamMap.get('polygon') as string;
        this.startDate = this.route.snapshot.queryParamMap.get('dateStart') as string;
        this.endDate = this.route.snapshot.queryParamMap.get('dateEnd') as string;

        this.imageService.getListDatesImagesASFBetweenDates(this.polygon, this.startDate, this.endDate)
        .subscribe((data) => {
            this.listDateASFImages = data;
        });
        // Vérifiez si la page a déjà été rechargée
        if (!localStorage.getItem('reloaded')) {
            // Si ce n'est pas le cas, rechargez la page et définissez la variable 'reloaded' à 'true'
            localStorage.setItem('reloaded', 'true');
            location.reload();
        } else {
            // Si la page a déjà été rechargée, réinitialisez la variable 'reloaded'
            localStorage.removeItem('reloaded');
        }
    }

    onMouseOver(): void {
        this.buttonImage = "assets/Back_Arrow_white.svg";
    }

    onMouseOut(): void {
        this.buttonImage = "assets/Back_Arrow.svg";
    }

    onBackButtonClick(): void {
        this.router.navigate(['']);
    }
}
