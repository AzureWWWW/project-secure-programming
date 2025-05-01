import { Component, inject, OnInit } from '@angular/core';
import { Appointment } from '../../../models/appointment';
import { ConfigService } from '../../../services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoTableComponent } from "../../info-table/info-table.component";
import { UpdateAppointmentDialogComponent } from '../update-appointment-dialog/update-appointment-dialog.component';


@Component({
  selector: 'app-appointment-table-view',
  imports: [InfoTableComponent, UpdateAppointmentDialogComponent],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.css'
})
export class AppointmentTableComponent implements OnInit {
  constructor( public dialog: MatDialog) {}
  configService = inject(ConfigService);


  UpdateAppointmentDialogComponent = UpdateAppointmentDialogComponent;
  id_name = "appointment_id";
  func_call = this.configService.getDoctorAppointments();

  columns: string[] = ['actions', 'patient_name', 'date','time', 'description', 'status'];
  filteredData: Appointment[] = [];
  _filterText: string = '';

  // get all doctor appointments data
  getAppointments(){
    this.configService.getDoctorAppointments().subscribe(
      (response) => {
        this.filteredData = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit():void{
    this.getAppointments();
  }

}

