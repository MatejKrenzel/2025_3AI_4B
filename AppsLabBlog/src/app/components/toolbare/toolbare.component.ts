import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbare',
  imports: [MatButtonModule,MatToolbarModule,MatIconModule],
  templateUrl: './toolbare.component.html',
  styleUrl: './toolbare.component.css'
})
export class ToolbareComponent {

}
