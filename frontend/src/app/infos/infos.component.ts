import { Component, OnInit } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { formatDate, CommonModule } from '@angular/common';
import {PolygonService} from "../services/polygon.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-infos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.scss']
})
export class InfosComponent implements OnInit {
  submit = false;
  noConform = false;
  startDate!: string;
  endDate!: string;
  polygon!: string;
  gptPath!: string;
  order: 'asc' | 'desc' = 'asc';

  constructor(private polygonService: PolygonService, private router: Router) {}

  onPolygonChange() {
    this.polygonService.setPolygon(this.polygon);
  }
  ngOnInit() {
    let today = new Date();
    this.startDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
    this.endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
    this.polygonService.polygon$.subscribe(polygon => {
      this.polygon = polygon;
    });  }

  onSubmit(f : NgForm) {
    this.noConform = (f.value.gptPath == null || f.value.username == null || f.value.password == null || f.value.polygon == null) || (f.value.gptPath == "" || f.value.username == "" || f.value.password == "" || f.value.polygon == "");
    this.submit = true;
    console.log(f.value)
    if (!this.noConform){
      this.router.navigate(['/results']);
    }
  }
}
