
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.doctor import Doctor
from app.database import get_db
from sqlalchemy.orm import Session
from app.schemas.appointment import AppointmentCreate, AdminAppointmentUpdate, UserAppointmentUpdate, getAvailableAppointment, patientAddAppointment
from app.models.appointment import Appointment
from app.models.user import User
from app.api.endpoints.patients import get_patient_name_by_id, get_patient_id_by_Name, get_patient_id_by_user_id, isPatientValid, getPatientId
from app.api.endpoints.doctors import get_all_doctors, get_doctor_name_by_id, get_doctor_id_by_Name, get_doctor_id_by_user_id, isDoctorValid, getDoctorId
from app.core.utils import Is_User_Valid, get_current_user, get_current_admin
from datetime import date, datetime, time
router = APIRouter()

allowed_status = ['SCHEDULED', 'CANCELLED', 'CONFIRMED', 'IN PROGRESS', 'COMPLETED', 'CONFIRMED']
@router.post("/addAppointment/")
def create_appointment(user_data: AppointmentCreate, db: Session = Depends(get_db)):
    #check patient_id and doctor_id exist
    patient_validity = Is_User_Valid(user_data.patient_id, "patient",db)
    doctor_validity = Is_User_Valid(user_data.doctor_id, "doctor",db)
    if patient_validity == False :
        raise HTTPException(status_code=404, detail="Patient Not Found")
    elif doctor_validity == False:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    db_appointment = Appointment(patient_id = user_data.patient_id, doctor_id= user_data.doctor_id, description = user_data.description, date_time = user_data.date_time )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return {"message": "Appointment Successfully Added"}


@router.get("/getAllAppointments/")
def get_all_appointments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role== "admin":
        info = []
        appointment_db = db.query(Appointment).all()
        for appointment in appointment_db:
            patient_name = get_patient_name_by_id(appointment.patient_id,db)
            doctor_name = get_doctor_name_by_id(appointment.doctor_id,db)
            app_data = {"appointment_id": appointment.appointment_id,
                        "patient_name":patient_name,
                        "doctor_name":doctor_name,
                        "description":appointment.description,
                        "date_time":appointment.date_time,
                        "status": appointment.status }
            info.append(app_data)

        return info
    raise HTTPException(status_code=404, detail="Administrator Privileges are Needed")

@router.get("/getDoctorAppointments/")
def getDoctorAppointments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doctor_id = getDoctorId(current_user.user_id, db)
    info = []
    appointment = db.query(Appointment).filter(Appointment.doctor_id == doctor_id).first()
    patient_name = get_patient_name_by_id(doctor_id,db)
    app_data = {"appointment_id": appointment.appointment_id,
            "patient_name":patient_name,
            "description":appointment.description,
            "date_time":appointment.date_time,
            "status": appointment.status}
    info.append(app_data)
    return info


@router.get("/getPatientAppointments/")
def getPatientAppointments( db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    patient_id = getPatientId(current_user.user_id, db)
    info = []
    appointment = db.query(Appointment).filter(Appointment.patient_id == patient_id).first()
    doctor_name = get_doctor_name_by_id(patient_id,db)
    app_data = {"appointment_id": appointment.appointment_id,
            "doctor_name":doctor_name,
            "description":appointment.description,
            "date_time":appointment.date_time,
            "status": appointment.status }
    info.append(app_data)
    return info


@router.put("/adminUpdateAppointment/{id}")
def admin_update_appointment(id:int, data: AdminAppointmentUpdate,
                             db: Session = Depends(get_db),
                             current_admin: User = Depends(get_current_admin)):
    appointment = db.query(Appointment).filter(Appointment.appointment_id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment Not Found")
    
    if data.patient_name:
        patient_id = get_patient_id_by_Name(data.patient_name,db)
        if not Is_User_Valid(patient_id, "patient", db):
            raise HTTPException(status_code=404, detail="Patient Not Found")
        appointment.patient_id = patient_id
    
    #in case user didn't provide the new patient_name and the old patient status is no more valid
    if not Is_User_Valid(appointment.patient_id, "patient", db):
        raise HTTPException(status_code=404, detail="Patient Not Found")

    
    if data.doctor_name:
        doctor_id = get_doctor_id_by_Name(data.doctor_name,db)
        if not Is_User_Valid(doctor_id, "doctor", db):
            raise HTTPException(status_code=404, detail="Doctor Not Found") 
        appointment.doctor_id = doctor_id
        
    #in case user didn't provide the new doctor_name and the old doctor status is no more valid 
    if not Is_User_Valid(appointment.doctor_id, "doctor", db):
        raise HTTPException(status_code=404, detail="Doctor Not Found") 

    if data.description:
        appointment.description = data.description
    if data.date_time:
        appointment.date_time = data.date_time
    if data.status:
        if data.status.upper() not in allowed_status:
            raise HTTPException(status_code=404, detail="Invalid Appointment Status")
        appointment.status = data.status.upper()
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment Successfully Updated"}

@router.put("/userUpdateAppointment/{id}")
def user_update_appointment(id:int, data: UserAppointmentUpdate,
                             db: Session = Depends(get_db),
                             current_user: User = Depends(get_current_user)
                             ):
    appointment = db.query(Appointment).filter(Appointment.appointment_id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment Not Found")
    
    # Ensure that the logged-in user is a doctor/ patient and they are updating their own information
    if current_user.role == "doctor":
        doctor_id = isDoctorValid(current_user.user_id, db)
        if doctor_id == 0:
            raise HTTPException(status_code=404, detail="Doctor Privileges are Required")
        if appointment.doctor_id != doctor_id:
            raise HTTPException(status_code=404, detail="You Are Not Allowed to Update This Appointment")
        
    elif current_user.role == "patient":
        patient_id = isPatientValid(current_user.user_id, db)
        if patient_id == 0:
            raise HTTPException(status_code=404, detail="Patient Privileges are Required")
        if appointment.patient_id != patient_id:
            raise HTTPException(status_code=404, detail="You Are Not Allowed to Update This Appointment")
    

    if data.description:
        appointment.description = data.description
    if data.date_time:
        appointment.date_time = data.date_time
    if data.status:
        if data.status.upper() not in allowed_status:
            raise HTTPException(status_code=404, detail="Invalid Appointment Status")
        appointment.status = data.status.upper()
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment Successfully Updated"}

def get_user_appointments_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user_db =  db.query(User).filter(User.user_id == user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User Not Found")
    if user_db.role == "patient":
        id = get_patient_id_by_user_id(user_id,db)
        appointments = db.query(Appointment).filter(Appointment.patient_id == id).all()
    elif user_db.role == "doctor":
        id = get_doctor_id_by_user_id(user_id,db)
        appointments = db.query(Appointment).filter(Appointment.doctor_id == id).all()
    return appointments

@router.delete("/deactivateAppointment/{id}")
def deactivate_appointment(appointment_id:int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.appointment_id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment Not Found")
    appointment.status = "CANCELLED"
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment Deactivated"}

##### For new appointment #####
time_slots = {
    1: time(8, 0),   # 8:00 AM for Time Slot 1
    2: time(11, 0),  # 11:00 AM for Time Slot 2
    3: time(14, 0)   # 2:00 PM for Time Slot 3
}


def splitTimeToSlot(dateTimeObj: datetime):
    time_part = dateTimeObj.time()

    time_slot = None
    for slot, time_for_slot in time_slots.items():
        if time_part < time(8,0):
            time_slot = 1
        elif time_part >= time_for_slot and (time_part < time_slots.get(slot + 1, time(23, 59))):
            time_slot = slot
            break

    return time_slot

def combineDateTimeSlot(date: datetime, timeslot: int) -> datetime:
    selected_time = time_slots.get(timeslot)
    if not selected_time:
        raise ValueError("Invalid timeslot selected.")
    return datetime.combine(date, selected_time)

@router.post("/getAvailableAppointment")
def get_available_appointment(checkAvailableAppointment: getAvailableAppointment , db: Session = Depends(get_db)):
    details = []

    doctors_db = db.query(Doctor).filter(Doctor.doctor_specialty==checkAvailableAppointment.specialty).all()

    for doctor in doctors_db:
        doctor_name = get_doctor_name_by_id(doctor.doctor_id,db)
        slot_available = {1: True, 2: True, 3: True}        # by default all 3 slots will be vacant
        app_data = {
            "doctor_name": doctor_name,
            "time_slot": slot_available
            }
        
        # query appointment based on doctor_id and the date 
        appointments_db = db.query(Appointment).filter(Appointment.doctor_id == doctor.doctor_id,
                                                    Appointment.date_time >= datetime.combine(checkAvailableAppointment.date, datetime.min.time()),  # Convert date to datetime
                                                    Appointment.date_time < datetime.combine(checkAvailableAppointment.date, datetime.max.time())).all()
    
        if not appointments_db:     # if there is no appointment on that date, so 3 slots are vacant
            details.append(app_data)
            continue
    
        for appointment in appointments_db:     # if there is appointment on the date
            slot = splitTimeToSlot(appointment.date_time)
            if appointment.status != "CANCELLED":       # if the slot is not cancelled then it is reserved
                slot_available[slot] = False
        details.append(app_data)

    info = {
         "specilaty": checkAvailableAppointment.specialty,
         "date": checkAvailableAppointment.date,
         "details": details
    }
    return info

@router.post("/patientCreateAppointment/")
def create_appointment(user_data: patientAddAppointment, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "patient":
        patient_id = get_patient_id_by_user_id(current_user.user_id,db)
    elif current_user.role == "doctor": # if doctor want to book appointment as a patient
        patient_id = get_doctor_id_by_user_id(current_user.user_id,db)
    doctor_id = get_doctor_id_by_Name(user_data.doctor_name,db)
    date_time = combineDateTimeSlot(user_data.date, user_data.time_slot)
    
    # check if that slot is already reserved
    appointments_db = db.query(Appointment).filter(Appointment.doctor_id == doctor_id,
                                                    Appointment.date_time >= datetime.combine(user_data.date, datetime.min.time()),  # Convert date to datetime
                                                    Appointment.date_time < datetime.combine(user_data.date, datetime.max.time())).all()
    if appointments_db:
        for appointment in appointments_db:
            if splitTimeToSlot(appointment.date_time) == user_data.time_slot:
                return {"message": "This time is reserved"}
    
    # create new appointment
    new_appointment = Appointment(patient_id = patient_id, doctor_id= doctor_id, description = user_data.description, date_time =  date_time)
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return {"message": "Appointment Successfully Added"}