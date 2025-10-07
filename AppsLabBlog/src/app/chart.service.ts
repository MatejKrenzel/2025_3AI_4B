import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface ChartData {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private firestore = inject(Firestore);

getChartData(): Observable<ChartData[]> {
  const chartCollection = collection(this.firestore, 'Charts');
  return collectionData(chartCollection, { idField: 'id' }) as Observable<ChartData[]>;
}
}
