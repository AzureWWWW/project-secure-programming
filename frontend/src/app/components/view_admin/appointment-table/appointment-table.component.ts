import { Component , OnInit, inject} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../services/config.service';
import { Appointment } from '../../../models/appointment';
import { InfoTableComponent } from '../../info-table/info-table.component';
import { UpdateAppointmentDialogComponent } from '../update-appointment-dialog/update-appointment-dialog.component';

@Component({
  selector: 'app-appointment-table-component',
  imports: [
    InfoTableComponent, UpdateAppointmentDialogComponent],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.css'
})
export class AppointmentTableComponent implements OnInit {
  constructor( public dialog: MatDialog) {}

  configService = inject(ConfigService);

  UpdateAppointmentDialogComponent = UpdateAppointmentDialogComponent;
  id_name = "appointment_id";
  func_call = this.configService.getAppointmentData();
  columns: string[] = ['actions', 'patient_name', 'doctor_name', 'date','time', 'description', 'status'];
  filteredData: Appointment[] = [];

  _filterText: string = '';


  // get all appointments data
  getAllAppointments(){
    this.configService.getAppointmentData().subscribe(
      (response) => {
        this.filteredData = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit():void{
    // console.log('Dialog component:', this.UpdateAppointmentDialogComponent);
    this.getAllAppointments();
  }

}


