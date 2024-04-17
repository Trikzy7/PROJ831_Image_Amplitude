import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { TimeScale, TimeSeriesScale } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(TimeScale, TimeSeriesScale);

import {LinearScale } from 'chart.js';
Chart.register(LinearScale);

import { Chart, LineController, LineElement, PointElement } from 'chart.js';
Chart.register(LineController, LineElement, PointElement);

interface AmplitudeData {
  date: string;
  sigma_VH: number;
  sigma_VV: number;
}

@Component({
  selector: 'app-graph-amplitude',
  templateUrl: './graph-amplitude.component.html',
  standalone: true,
  styleUrls: ['./graph-amplitude.component.scss']
})
export class GraphAmplitudeComponent implements OnInit {
  ngOnInit() {
    d3.json<{ [key: string]: { sigma_VH: number, sigma_VV: number } }>('assets/amplitudeValues.json').then(data => {
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

      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      if (ctx === null) {
        throw new Error("Element with id 'myChart' not found");
      }
      let myChart = new Chart(ctx, {
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
          }
        }
      });
    });
  }
}