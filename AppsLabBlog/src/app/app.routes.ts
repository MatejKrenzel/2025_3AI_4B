import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from '@swimlane/ngx-charts';
import { GraphComponent } from './components/chart/chart.component';
import { NewPostComponent  } from "./components/new-post/new-post.component";
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminGuard } from './admin.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'register', component: RegisterComponent },  
    { path: 'chart', component: GraphComponent },
    { path: 'AddPost', component: NewPostComponent, },
    { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },


];