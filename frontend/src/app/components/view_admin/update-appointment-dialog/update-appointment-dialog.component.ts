import { Component,  inject, OnInit, Input, Inject} from '@angular/core';
import {CommonModule } from '@angular/common';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { UpdateDialogComponent } from '../../update-dialog/update-dialog.component';
import { ConfigService } from '../../../services/config.service';


@Component({
  selector: 'app-update-appointment-dialog',
  imports: [CommonModule, MatDialogModule, UpdateDialogComponent],
  templateUrl: './update-appointment-dialog.component.html',
  styleUrl: './update-appointment-dialog.component.css'
})
export class UpdateAppointmentDialogComponent  implements OnInit{
  configService = inject(ConfigService);
  id: number;
  title: string;
  func_call: any;
  id_name:string;
  update_function = this.configService.admin_update_appointmentData.bind(this.configService);
  fields = [
    { label: 'Patient Name', name: 'patient_name', type: 'text'},
    { label: 'Doctor Name', name: 'doctor_name', type: 'text'},
    { label: 'Description', name: 'description', type: 'text'},
    { label: 'Date', name: 'date', type: 'date'},
    { label: 'Time', name: 'time', type: 'time'},
    { label: 'Status', name: 'status', type: 'text', validate: true }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    this.title = data.title;
    this.func_call = data.func_call;
    this.id_name = data.id_name;
  }

  ngOnInit(): void {

  }


}
