import { Component, inject, OnInit } from '@angular/core';import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single } from './data';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [NgxChartsModule],
})
export class GraphComponent implements OnInit {
  firestore = inject(Firestore);

  single: any[] = []; // Data for the chart
  view: [number, number] = [700, 400];

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#1fb112ff', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  ngOnInit(): void {
    const countriesRef = collection(this.firestore, 'Charts');
    collectionData(countriesRef, { idField: 'id' }).subscribe((data: any[]) => {
      // Make sure each item has a `name` and `value`
      this.single = data.map(item => ({
        name: item.name,
        value: item.value,
      }));
    });
  }

  onSelect(data: { name: string; value: number }): void {
    console.log('Item clicked', data);
  }

  onActivate(data: { name: string; value: number }): void {
    console.log('Activate', data);
  }

  onDeactivate(data: { name: string; value: number }): void {
    console.log('Deactivate', data);
  }
}