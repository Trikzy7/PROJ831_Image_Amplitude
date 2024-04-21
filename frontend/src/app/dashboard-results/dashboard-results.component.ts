import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../services/dashboard.service";
import {SliderImagesComponent} from "../slider-images/slider-images.component";
import {MapComponent} from "../map/map.component";
import {GraphAmplitudeComponent} from "../graph-amplitude/graph-amplitude.component";
import {Router} from "@angular/router";

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

    constructor(protected dashboardService: DashboardService, private router: Router) { }

    ngOnInit(): void {
        this.dashboardService.setIsOnDashboard(true);
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
