import { Component } from '@angular/core';
import { InfoTableComponent } from '../components/info-table/info-table.component';
import { AppointmentTableComponent } from '../components/admin_view/appointment-table/appointment-table.component';
import { PatientTableComponent } from '../components/admin_view/patient-table/patient-table.component';
@Component({
  selector: 'app-info',
  imports: [InfoTableComponent, AppointmentTableComponent, PatientTableComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {

}
