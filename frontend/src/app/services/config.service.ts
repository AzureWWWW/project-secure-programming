import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { Patient } from '../models/patient';
import { Doctor } from '../models/doctor';
import { User } from '../models/user';


// to inject services on other places
@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  private config: any;
  constructor(private http: HttpClient){
    this.config = {
      "base_url": "http://localhost:8000/",
    };
  }

  // get the base Url
  getBaseUrl(): String{
    return this.config.base_url
  }

  getUserRole(id: number): Observable<any>{
    const appointment_url =`${this.config.base_url}users/getUserRole/${id}`;
    return this.http.get(appointment_url);
  }

  // ****************** Admin View ******************

  // get all appointments history
  getAppointmentData(): Observable<any>{
    const appointment_url = this.config.base_url + "appointments/getAllAppointments";
    return this.http.get(appointment_url);
  }

  // update an appointment
  admin_update_appointmentData(id: number, updatedAppointment: Appointment): Observable<any>{
    const appointment_url = `${this.config.base_url}appointments/adminUpdateAppointment/${id}`;
    return this.http.put(appointment_url, updatedAppointment);
  }

  // get all patients history
  getPatientData(): Observable<any>{
    const patient_url = this.config.base_url + "patients/getAllPatients";
    return this.http.get(patient_url);
  }

  // update patients data
  update_patientData(id: number, updatedPatient: Patient): Observable<any>{
    const patient_url = `${this.config.base_url}patients/updatePatient/${id}`;
    return this.http.put(patient_url, updatedPatient);
  }
  // get all patients history
  getDoctorData(): Observable<any>{
    const doctor_url = this.config.base_url + "doctors/getAllDoctors";
    return this.http.get(doctor_url);
  }

  // update patients data
  update_doctorData(id: number, updatedDoctor: Doctor): Observable<any>{
    const doctor_url = `${this.config.base_url}doctors/updateDoctor/${id}`;
    return this.http.put(doctor_url, updatedDoctor);
  }

  // ****************** Doctor View & Patient View ******************

  // get a doctor appointments
  getDoctorAppointments(id: number): Observable<any>{
    // We are passing the doctor_id
    const doctor_url = `${this.config.base_url}appointments/getDoctorAppointments/${id}`;
    return this.http.get(doctor_url);
  }

  // get a patient appointments
  getPatientAppointments(id: number): Observable<any>{
    // We are passing the patient_id
    const doctor_url = `${this.config.base_url}appointments/getPatientAppointments/${id}`;
    return this.http.get(doctor_url);
  }

  // update an appointment
  user_update_appointmentData(id: number, updatedAppointment: Appointment): Observable<any>{
    const appointment_url = `${this.config.base_url}appointments/userUpdateAppointment/${id}`;
    return this.http.put(appointment_url, updatedAppointment);
  }

  getUserInfo(user_id: number): Observable<any>{
    const user_url = `${this.config.base_url}users/getUserInfo/${user_id}`;
    return this.http.get(user_url);
  }
  update_my_profile(updatedProfile: Doctor):Observable<any>{
    const user_url = this.config.base_url + "users/updateMyProfile/";
    return this.http.put(user_url, updatedProfile);
  }

}
