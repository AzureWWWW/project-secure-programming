import { Component , OnInit, inject} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '../../../services/config.service';
import { Patient } from '../../../models/patient';
import { InfoTableComponent } from '../../info-table/info-table.component';
import { UpdatePatientDialogComponent } from '../update-patient-dialog/update-patient-dialog.component';



@Component({
  selector: 'app-patient-table-component',
  imports: [InfoTableComponent, UpdatePatientDialogComponent],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.css'
})
export class PatientTableComponent implements OnInit{
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  configService = inject(ConfigService);

  columns: string[] = [ 'actions','patient_name', 'username', 'email', 'phone_number', 'status_expiry'];
  UpdatePatientDialogComponent = UpdatePatientDialogComponent;
  id_name = "patient_id";
  func_call = this.configService.getPatientData();

  filteredData: Patient[] = [];
  _filterText: string = '';


  // get all patients data
  getAllPatients(){
    this.configService.getPatientData().subscribe(
      (response) => {
        this.filteredData = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  ngOnInit():void{
    this.getAllPatients();
  }

}
