from pydantic import BaseModel
from datetime import datetime, date

# pydantic model for appointment
class AppointmentCreate(BaseModel):
    patient_id : int
    doctor_id : int
    description : str
    date_time : datetime
    
class AdminAppointmentUpdate(BaseModel):

    patient_name: str
    doctor_name: str
    description : str
    date_time : datetime
    status : str

class UserAppointmentUpdate(BaseModel):
    description : str
    date_time : datetime
    status : str

class getAvailableAppointment(BaseModel):
    specialty: str
    date: date

class patientAddAppointment(BaseModel):
    doctor_name: str
    date: date
    time_slot: int
    description: str
