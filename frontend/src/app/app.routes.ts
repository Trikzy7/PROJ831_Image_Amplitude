import { Routes } from '@angular/router';
import {ConfigurationMapComponent} from "./configuration-map/configuration-map.component";
import {DashboardResultsComponent} from "./dashboard-results/dashboard-results.component";

export const routes: Routes = [
    { path: '', component: ConfigurationMapComponent },
    { path: 'results', component: DashboardResultsComponent },
];

