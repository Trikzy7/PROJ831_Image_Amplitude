import { Component, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  map!: Map;
  draw!: Draw;
  vectorLayer!: VectorLayer<any>;
  polygon!: string;

  constructor(private polygonService: PolygonService) {}

  ngAfterViewInit() {
    if (typeof document !== 'undefined') {
      this.initMap();
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

    this.map.addLayer(this.vectorLayer);

    this.draw = new Draw({
      source: source,
      type: 'Circle',
      geometryFunction: createBox()
    });

    this.map.addInteraction(this.draw);

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

  formatPolygon(coordinates: number[][][]): string {
    const polygonCoords = coordinates[0].map(coord => coord.join(' ')).join(', '); // Formater les coordonnées en paires de nombres séparées par un espace
    return `POLYGON ((${polygonCoords}))`; // Formater le polygone dans la chaîne POLYGON ((...))
  }

  private drawPolygon(polygon: string) {
    if (!this.vectorLayer) {
      console.error('Vector layer is not initialized yet');
      return;
    }

    this.vectorLayer.getSource().clear();

    const polygonCoords = polygon
        .replace('POLYGON ((', '')
        .replace('))', '')
        .split(', ')
        .map(coord => coord.split(' ').map(Number));

    const polygonGeometry = new Polygon([polygonCoords]);

    const polygonFeature = new Feature({
      geometry: polygonGeometry
    });

    this.vectorLayer.getSource().addFeature(polygonFeature);

    // Zoom sur le polygone
    const polygonExtent = polygonGeometry.getExtent();
    this.map.getView().fit(polygonExtent, { padding: [100, 100, 100, 100] });
  }

}