import { Component , OnInit, inject, Input} from '@angular/core';

import {MatTableModule} from '@angular/material/table';
import {CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule } from '@angular/material/dialog';

// import { HttpClient} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '../../services/config.service';

// import { UpdatePatientDialogComponent } from '../admin_view/update-patient-dialog/update-patient-dialog.component';
// import { UpdateAppointmentDialogComponent } from '../admin_view/update-appointment-dialog/update-appointment-dialog.component';
// import { UpdateDoctorDialogComponent } from '../admin_view/update-doctor-dialog/update-doctor-dialog.component';


@Component({
  selector: 'app-info-table',
  imports: [CommonModule , MatTableModule,
    FormsModule, MatIconModule, MatDialogModule ],
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.css'

})

export class InfoTableComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  configService = inject(ConfigService);

  @Input() columns: string[] = [];
  @Input() filteredData: any[] = [];
  @Input() title: string = '';
  @Input() cpt!: any;
  @Input() id_name: string = '';
  @Input() func_call: any;

  _filterText: string = '';
  dataSource: any[] = [];

  ngOnInit():void{
    this.dataSource = this.filteredData;
  }


  // getter and setter for the text the user is entering within the filtering box
  get filterText(){
    return this._filterText;
  }
  set filterText(value: string){
    this._filterText = value;
  }


  // filter data based on the entered filter text
  filterData(){
    const term = this.filterText.toLowerCase();
    if (!term) {
      this.filteredData = [...this.dataSource];
      return;
    }
    this.filteredData = this.dataSource.filter(app =>
      this.columns.some(col =>
        String(app[col])?.toLowerCase().includes(term)
      )
    );

  }
  updateDialog(element: any){
    let element_id = element[this.id_name];
    if (!this.cpt || this.id_name === undefined) {
      console.warn('Dialog component or ID is missing for:', this.title);
      return;
    }
      // open dialog
    const dialogRef = this.dialog.open(this.cpt , {
      data: {
        id: element_id,
        title: this.title,
        func_call: this.func_call,
        id_name: this.id_name,
      },
      width: '500px',
      height: '550px',
    });



    // update results view after the dialog being closed
    dialogRef.afterClosed().subscribe(result => {
      if (this.func_call) {
        this.func_call.subscribe(
          (response:any) => {
            this.dataSource = response;
            this.filteredData = response;
          },
          (error:any) => {
            console.error('Error fetching data:', error);
          }
        );
      }

    });
  }

  }

