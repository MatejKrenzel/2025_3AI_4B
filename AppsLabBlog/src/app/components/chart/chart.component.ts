import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartService } from '../../chart.service';



@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [NgxChartsModule],
})

export class GraphComponent implements OnInit {
  single: ChartData[] = [];
  view: [number, number] = [700, 400];

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#1fb112ff', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.chartService.getChartData().subscribe((data: ChartData[]) => {
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
interface ChartData {
  name: string;
  value: number;
}
