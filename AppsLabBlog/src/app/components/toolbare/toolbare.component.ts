import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-toolbare',
  imports: [MatButtonModule,MatToolbarModule,MatIconModule,],
  templateUrl: './toolbare.component.html',
  styleUrl: './toolbare.component.css'
})
export class ToolbareComponent {
}