import { Component , OnInit, inject} from '@angular/core';
import { InfoTableComponent } from "../../info-table/info-table.component";
import { MatDialog } from '@angular/material/dialog';
import { UpdateDoctorDialogComponent } from '../update-doctor-dialog/update-doctor-dialog.component';
import { HttpClient} from '@angular/common/http';
import { ConfigService } from '../../../services/config.service';
import { Doctor } from '../../../models/doctor';

@Component({
  selector: 'app-doctor-table',
  imports: [InfoTableComponent,UpdateDoctorDialogComponent],
  templateUrl: './doctor-table.component.html',
  styleUrl: './doctor-table.component.css'
})
export class DoctorTableComponent implements OnInit{
  constructor(private http: HttpClient, public dialog: MatDialog) {}

  configService = inject(ConfigService);

  columns: string[] = [ 'actions','doctor_name', 'username', 'email', 'phone_number', 'status_expiry'];
  UpdateDoctorDialogComponent = UpdateDoctorDialogComponent;
  id_name = "doctor_id";
  func_call = this.configService.getDoctorData();
  filteredData: Doctor[] = [];

  _filterText: string = '';

  // get all doctors data
  getAllDoctors(){
    this.configService.getDoctorData().subscribe(
      (response) => {
        this.filteredData = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  ngOnInit():void{
    this.getAllDoctors();
  }

}
