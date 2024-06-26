import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TimeScale, TimeSeriesScale } from 'chart.js';
import 'chartjs-adapter-moment';
import {LinearScale } from 'chart.js';
import { Chart, Legend, LineController, LineElement, PointElement } from 'chart.js';
import { HttpClient } from '@angular/common/http';
Chart.register(TimeScale, TimeSeriesScale);
Chart.register(LinearScale);
Chart.register(LineController, LineElement, PointElement);
import { AmplitudeService } from '../services/amplitude.service'; // Import the AmplitudeService

Chart.register(Legend, TimeScale, TimeSeriesScale, LineController, LineElement, PointElement);

@Component({
  selector: 'app-graph-amplitude',
  templateUrl: './graph-amplitude.component.html',
  standalone: true,
  styleUrls: ['./graph-amplitude.component.scss']
})
export class GraphAmplitudeComponent implements OnInit, AfterViewInit {

  myChartInstance: Chart | null = null;
  @ViewChild('myChart') myChart!: ElementRef;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private amplitudeService : AmplitudeService) { }

  ngOnInit() {
    this.amplitudeService.currentAmplitudeData.subscribe(data => {
      this.updateGraph();
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<{ [key: string]: { sigma_VH: number, sigma_VV: number } }>('assets/amplitudeValues.json').subscribe(data => {
        if (data === undefined) {
          throw new Error("No data returned from 'assets/amplitudeValues.json'");
        }

        const dataArray = Object.entries(data).map(([date, value]) => ({
          date,
          sigma_VH: value.sigma_VH,
          sigma_VV: value.sigma_VV
        }));

        const labels = dataArray.map(d => d.date);
        const sigma_VH = dataArray.map(d => +d.sigma_VH);
        const sigma_VV = dataArray.map(d => +d.sigma_VV);

        this.createChart(labels, sigma_VH, sigma_VV);
      });
    }
  }

  createChart(labels: string[], sigma_VH: number[], sigma_VV: number[]) {
    if (!this.myChart) {
      console.error('myChart is not defined');
      return;
    }

    const ctx = this.myChart.nativeElement.getContext('2d');
    if (ctx === null) {
      throw new Error("Element with id 'myChart' not found");
    }

    // If a chart instance already exists, destroy it
    if (this.myChartInstance) {
      this.myChartInstance.destroy();
    }

    this.myChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'sigma_VH',
          data: sigma_VH,
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
        }, {
          label: 'sigma_VV',
          data: sigma_VV,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              parser: 'YYYY-MM-DD'
            }
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom', // Position de la légende
          }
        }
      }
    });
  }


  updateGraph() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<{ [key: string]: { sigma_VH: number, sigma_VV: number } }>('assets/amplitudeValues.json').subscribe(data => {
        if (data === undefined) {
          throw new Error("No data returned from 'assets/amplitudeValues.json'");
        }

        const dataArray = Object.entries(data).map(([date, value]) => ({
          date,
          sigma_VH: value.sigma_VH,
          sigma_VV: value.sigma_VV
        }));

        const labels = dataArray.map(d => d.date);
        const sigma_VH = dataArray.map(d => +d.sigma_VH);
        const sigma_VV = dataArray.map(d => +d.sigma_VV);

        this.createChart(labels, sigma_VH, sigma_VV);
      });
    }
  }
}
