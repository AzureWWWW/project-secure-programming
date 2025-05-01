import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { authGuard } from './guard/auth.guard';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path:'',
    component:HeaderComponent,
    canActivate: [authGuard],
    children:[
      {
        path: 'home',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./home/home.component').then((m)=> m.HomeComponent);
        }
      },
      {
        path: 'Appointments_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_admin/appointment-table/appointment-table.component').then((m)=> m.AppointmentTableComponent);
        }
      },
      {
        path: 'Patients_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{
    
          return import('./components/view_admin/patient-table/patient-table.component').then((m)=> m.PatientTableComponent);
        }
      },
      {
        path: 'Doctors_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_admin/doctor-table/doctor-table.component').then((m)=> m.DoctorTableComponent);
        }
      },
      {
        path: 'Appointments_Doctor_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_doctor/appointment-table/appointment-table.component').then((m)=> m.AppointmentTableComponent);
        }
      },
      {
        path: 'Appointments_Patient_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_patient/appointment-table/appointment-table.component').then((m)=> m.AppointmentTableComponent);
        }
      },
      {
        path: 'my_Profile',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./my-profile/my-profile.component').then((m)=> m.MyProfileComponent);
        }
      },
      {
        path: 'new_appointment',
        pathMatch: 'full',
        component: NewAppointmentComponent
      }
    ]
  },
];
