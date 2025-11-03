import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartService } from '../services/chart.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { UserPost } from '../../components/interfaces/userpost';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [NgxChartsModule,MatToolbarModule,MatButtonModule,MatIconModule ],
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
  userPosts!: UserPost[];

constructor(
  private router: Router,
  private firestoreService: FirestoreService,
  private chartService: ChartService
) {
  this.firestoreService.getUserPosts().subscribe((data: UserPost[]) => {
    this.userPosts = data;
    console.log(this.userPosts);
  });
}


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
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}

interface ChartData {
  name: string;
  value: number;
}
