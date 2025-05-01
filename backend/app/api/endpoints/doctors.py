from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.doctor import AdminUpdateDoctor
from app.database import get_db
# from schemas.doctor import DoctorUpdate
from app.core.utils import isNameValid, get_current_user, get_current_admin
from app.models.user import User
from app.models.doctor import Doctor

router = APIRouter()




def get_doctor_name_by_id(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.doctor_id==doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    user = db.query(User).filter(User.user_id == doctor.user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail="Doctor is Not a User")
    return  f"{user.first_name} {user.last_name}"



def get_doctor_id_by_Name(doctor_name: str, db: Session = Depends(get_db)):
    if not isNameValid(doctor_name) :
        raise HTTPException(status_code=400, detail="Invalid Doctor Name")
    user = db.query(User).filter(User.first_name == doctor_name.split(' ')[0],  User.last_name ==doctor_name.split(' ')[1]).first() 
    if not user:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    doctor = db.query(Doctor).filter(Doctor.user_id == user.user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    return doctor.doctor_id

def get_doctor_id_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    doctor = db.query(Doctor).filter(Doctor.user_id== user.user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    return doctor.doctor_id



@router.get("/getAllDoctors/")
def get_all_doctors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role== "admin":
        info = []
        doctor_db = db.query(Doctor).all()
        for doctor in doctor_db:
            doctor_name = get_doctor_name_by_id(doctor.doctor_id,db)
            user = db.query(User).filter(User.user_id == doctor.user_id).first() 
            if not user:
                raise HTTPException(status_code=404, detail="User Not Found")
            app_data = {"doctor_id": doctor.doctor_id,
                        "doctor_name":doctor_name,
                        "username":user.username,
                        "status_expiry": doctor.status_expiry,
                        "email":user.email,
                        "phone_number": user.phone_number}
            info.append(app_data)
        return info
    raise HTTPException(status_code=404, detail="Administrator Privileges are Needed")

@router.get("getAllSpecialty/")
def get_All_Specialty(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    specialty_list = db.query(Doctor.doctor_specialty).filter(Doctor.status_expiry == None).distinct().all()
    return [specialty[0] for specialty in specialty_list]

@router.put("/update_doctor_status_expiry/")
def update_doctor_status_expiry(doctor_id: int, doctor_info: AdminUpdateDoctor, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    doctor = db.query(Doctor).filter(Doctor.doctor_id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    if doctor_info.status_expiry <=  datetime.now(timezone.utc):
        doctor.is_doctor = 0
    else:
        doctor.is_doctor = 1
    doctor.status_expiry = doctor_info.status_expiry
    db.commit()
    db.refresh(doctor)
    
    
def isDoctorValid(user_id:int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id==user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    if doctor.is_doctor == 0:
        return 0
    return doctor.doctor_id

def getDoctorId(user_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id, Doctor.is_doctor == 1).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor Not Found")
    return doctor.doctor_id