import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../../models/appointment';
import { ConfigService } from '../../../services/config.service';
import { InfoTableComponent } from "../../info-table/info-table.component";
import { UpdateAppointmentDialogComponent } from '../update-appointment-dialog/update-appointment-dialog.component';

@Component({
  selector: 'app-appointment-table',
  imports: [InfoTableComponent],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.css'
})

export class AppointmentTableComponent implements OnInit {
  constructor( public dialog: MatDialog) {}
    configService = inject(ConfigService);
    UpdateAppointmentDialogComponent = UpdateAppointmentDialogComponent;
    id_name = "appointment_id";
    func_call = this.configService.getPatientAppointments();

    columns: string[] = ['actions', 'doctor_name', 'date','time', 'description', 'status'];
    filteredData: Appointment[] = [];
    _filterText: string = '';

    // get all patient appointments data
    getAppointments(){
      this.configService.getPatientAppointments().subscribe(
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

