import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-appointment',
  imports: [FormsModule, CommonModule],
  templateUrl: './new-appointment.component.html',
  styleUrl: './new-appointment.component.css'
})
export class NewAppointmentComponent {
  
  specialtyList: any [] = [];
  selectedSpecialty: string = '';
  doctorsAvailable: any [] = [];
  clickedCheck: boolean = false;
  
  http = inject(HttpClient)
  
  checkForm: any = {
      "specialty": "",
      "date": ""
  }
  createForm: any = {
    "doctor_name": "",
    "date": "",
    "time_slot": 0,
    "description": ""
  }

  getSpecialty() {
    this.http.get("http://127.0.0.1:8000/doctorsgetAllSpecialty/").subscribe((res: any) => {
      this.specialtyList = res;
    }, (error: any) => {
      alert(error.error.detail);
      console.error('Error Fetching Data:', error);
    });
  }

  getAvailableAppointment(){
    if (this.checkForm.specialty != "" , this.checkForm.date != ""){
      this.http.post("http://127.0.0.1:8000/appointments/getAvailableAppointment",this.checkForm).subscribe((res: any) => {
        this.doctorsAvailable = res.details;
        this.clickedCheck = true;
      }, (error: any) => {
        alert(error.error.detail);
        console.error('Error Fetching Data:', error);
      });
    } else {
      alert("Select specialty and date")
    }
  }

  ngOnInit(): void {
    this.getSpecialty(); 
  }

  onCreate(){
    if (this.createForm.doctor_name != "", this.createForm.time_slot != 0){
      
      this.http.post("http://127.0.0.1:8000/appointments/patientCreateAppointment/",this.createForm).subscribe((res: any) => {
        alert(res.message)
      this.getAvailableAppointment()
     }, (error: any) => {
       alert(error.error.detail);
       console.error('Error Fetching Data:', error);
     });
    } else {
      alert("Select one doctor and suitable time slot")
    }
  }
}
