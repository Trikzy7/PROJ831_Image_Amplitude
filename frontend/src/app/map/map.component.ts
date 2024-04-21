import {Component, AfterViewInit, OnInit, ChangeDetectorRef} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Stroke, Fill } from 'ol/style';
import {createBox} from 'ol/interaction/Draw';
import {defaults as defaultControls, Zoom} from 'ol/control';
import { PolygonService } from "../services/polygon.service";
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import {HttpClient} from "@angular/common/http";
import {fromLonLat} from 'ol/proj';
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {DashboardService} from "../services/dashboard.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {toLonLat} from 'ol/proj';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage
  ],
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit, OnInit{
  map!: Map;
  draw!: Draw;
  vectorLayer!: VectorLayer<any>;
  polygon = "";
  map_dashboard!: Map;
  dashboard!: boolean;

  constructor(private polygonService: PolygonService, private http: HttpClient, protected dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.dashboard = this.dashboardService.getIsOnDashboard();
  }

  ngAfterViewInit() {
    if (typeof document !== 'undefined' && typeof window !== "undefined") {
      this.initMap();
    }

    if (this.polygon !== ""){
      this.polygonService.polygon$.subscribe(polygon => {
        this.polygon = polygon;
        if (this.map_dashboard) {
          this.drawPolygon(polygon);
        }
        this.cdr.detectChanges();
      });
    }
  }

  private initMap() {
    this.map = new Map({
      target: 'my-map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [200000, 5950000],
        zoom: 6.5
      }),
      controls: defaultControls({rotate: false, attribution: false, zoom:false}).extend([
        new Zoom({
          className: 'zoomInOut',
          zoomInTipLabel: 'Zoom in',
          zoomOutTipLabel: 'Zoom out',
        })
      ])
    });

    this.map_dashboard = new Map({
      target: 'my-map-dashboard',
      layers: [
          new TileLayer({
          source: new OSM()
          })
      ],
      view: new View({
        center: [0, 0],
        zoom: 0
      }),
      controls: defaultControls({rotate: false, attribution: false, zoom:false})
    });

    this.initDrawInteraction();
    }

  private initDrawInteraction() {

    this.polygonService.polygon$.subscribe(polygon => {
      this.polygon = polygon;
      this.drawPolygon(polygon);
    });

    const source = new VectorSource({ wrapX: false });

    this.vectorLayer = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#FE2E2E',
          width: 3
        })
      })
    });

    this.map ? this.map.addLayer(this.vectorLayer) : this.map_dashboard.addLayer(this.vectorLayer);

    this.draw = new Draw({
      source: source,
      type: 'Circle',
      geometryFunction: createBox()
    });


    this.map ? this.map.addInteraction(this.draw) : this.map_dashboard.addInteraction(this.draw);

    this.draw.on('drawend', (event) => {
      const features = source.getFeatures();
      if (features.length) {
        source.removeFeature(features[0]); // Supprimer le rectangle précédent
      }

      const polygonFeature = event.feature;
      const polygonGeometry = polygonFeature.getGeometry(); // Obtenir la géométrie du polygone
      if (polygonGeometry) {
        const coordinates = (polygonGeometry as Polygon).getCoordinates(); // Obtenir les coordonnées du polygone
        const formattedPolygon = this.formatPolygon(coordinates); // Formater les coordonnées comme souhaitée
        this.polygonService.setPolygon(formattedPolygon);
        console.log(formattedPolygon);
      }
    });
  }

  private drawPolygon(polygon: string) {
    if (!this.vectorLayer) {
      console.error('Vector layer is not initialized yet');
      return;
    }

    this.vectorLayer.getSource().clear()
    const polygonCoords = this.parsePolygonCoordinates(polygon)
    const projectedPolygonCoords = polygonCoords.map(coord => fromLonLat(coord)); // Convertir en coordonnées de la projection de la carte
    const polygonGeometry = new Polygon([projectedPolygonCoords]);
    const polygonFeature = new Feature({
      geometry: polygonGeometry
    });

    this.vectorLayer.getSource().addFeature(polygonFeature);

    // Zoom sur le polygone
    const polygonExtent = polygonGeometry.getExtent();
    this.map.getView().fit(polygonExtent, { padding: [100, 100, 100, 100] });
    this.map_dashboard.getView().fit(polygonExtent, { padding: [100, 100, 100, 100] });
    this.map_dashboard.addLayer(this.vectorLayer);
  }


  searchLocation() {
    const searchInput = (<HTMLInputElement>document.getElementById('search')).value;
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`).subscribe((data: any) => {
      if (data && data[0] && data[0].lat && data[0].lon) {
        this.zoomToLocation(data[0].lat, data[0].lon);
      }
    });
  }

  zoomToLocation(lat: string, lon: string) {
    const view = this.map.getView();
    view.animate({
      center: fromLonLat([parseFloat(lon), parseFloat(lat)]),
      zoom: 10
    });
  }



formatPolygon(coordinates: number[][][]): string {
  const polygonCoords = coordinates[0].map(coord => {
    const lonLat = toLonLat(coord);
    return lonLat.join(' ');
  }).join(', ');

  return `POLYGON ((${polygonCoords}))`;
}

  private parsePolygonCoordinates(polygon: string): number[][] {
    return polygon
        .replace('POLYGON ((', '')
        .replace('))', '')
        .split(', ')
        .map(coord => coord.split(' ').map(Number));
  }

  copyToClipboard(elementId: string) {
    let copyText = document.getElementById(elementId) as HTMLInputElement;
    copyText.select();
    document.execCommand('copy');
  }
}
