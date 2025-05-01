import { Component,  inject, OnInit, Input} from '@angular/core';
import {CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
// import {Appointment} from '../../models/appointment';
// import { HttpClient } from '@angular/common/http';
import {MatDialogModule, MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { InfoTableComponent } from '../info-table/info-table.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-update-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './update-dialog.component.html',
  styleUrl: './update-dialog.component.css',
})
export class UpdateDialogComponent implements OnInit{
  configService = inject(ConfigService);

  @Input() id : number = 0;
  @Input() title: string = '';
  @Input() func_call: any;
  @Input() id_name: string = '';
  @Input() fields: any[] = [];

  @Input() update_function!: (id: number, data: any) => Observable<any>;

  constructor(private dialogRef: MatDialogRef<InfoTableComponent>){}

  dataSource:  any[] = [];
  formData: any = {};
  ngOnInit(){
    this.getData();
  }
  getData(){
    if (this.func_call) {
      this.func_call.subscribe(
        (response:any) => {
          this.dataSource = response;
          this.get_initialData();
        },
        (error:any) => {
          console.error('Error fetching data:', error);
        }
      );
     }
  }
  get_initialData(): void {
    const element = this.dataSource.find(d => d[this.id_name] === this.id);
    for (let field of this.fields) {
      if (field.name == "date"){
        this.formData[field.name] = element['date_time'].split('T')[0];
      }
      else if (field.name== "time"){
        this.formData[field.name] = element['date_time'].split('T')[1].slice(0, 5);
      }
      else if (field.name == "status_expiry"){
        this.formData[field.name] = element['status_expiry'].split('T')[0];
      }

      else{
        this.formData[field.name] = element[field.name];
      }
      field.placeholder = this.formData[field.name];

    }
  }
  // check status validity
  isStatusValid(){
    if (this.title != 'appointments'){
      return false;
    }
    if(!this.formData['status']){
      return true;
    }
    const validStatus= new Set(['SCHEDULED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', '', 'CONFIRMED']);
    return validStatus.has(this.formData['status'].toUpperCase());
  }
  // call update function in the backend
  updateData(form: NgForm) {
    const updatedData: any = {};
    let set = 0;
    for (let field of this.fields) {
      if(field.name == "date" || field.name == "time"){
        if (set== 0){
          updatedData['date_time']= `${this.formData['date']}T${this.formData['time']}:00.000Z`;
          set = 1;
        }
      }
      else if (field.name == "status_expiry" ){
        updatedData[field.name] =new Date(this.formData[field.name]).toISOString();
      }

      else{
        updatedData[field.name] = this.formData[field.name];
      }
    }


    const url$ = this.update_function(this.id, updatedData);
    if (url$){
      url$.subscribe(
        (response: any) => {
          this.dataSource = response;
          this.get_initialData();

        },
        (error: any) => {
          alert(error.error.detail);
          console.error('Error Fetching Data:', error);
        }
      );
    }
    this.dialogRef.close();

    return updatedData;
  }
}




