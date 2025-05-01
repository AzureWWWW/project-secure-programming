from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.patient import AdminUpdatePatient
from app.database import get_db
# from schemas.user import UserUpdate
from app.core.utils import isNameValid, get_current_user, get_current_admin
from app.models.user import User
from app.models.patient import Patient
# import schemas
# import schemas.user

router = APIRouter()


@router.put("/update_patient_status_expiry/")
def update_doctor_status_expiry(patient_id: int, patient_info: AdminUpdatePatient, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    print(patient_info.status_expiry,"*****************************")
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    if patient_info.status_expiry <=  datetime.now(timezone.utc):
        patient.is_patient= 0
    else:
        patient.is_patient= 1
    patient.status_expiry = patient_info.status_expiry
    db.commit()
    db.refresh(patient)
    
def isPatientValid(user_id:int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.user_id==user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    if patient.is_patient == 0:
        return 0
    return patient.patient_id

    
def get_patient_name_by_id(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.patient_id==patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    user = db.query(User).filter(User.user_id == patient.user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail="Patient is Not a User")
    return  f"{user.first_name} {user.last_name}"



def get_patient_id_by_Name(patient_name: str, db: Session = Depends(get_db)):
    # user needs to enter first and last name
    if isNameValid(patient_name):
        user = db.query(User).filter(User.first_name == patient_name.split(' ')[0], User.last_name ==patient_name.split(' ')[1]).first() 
        if not user:
            raise HTTPException(status_code=404, detail="Patient Not Found")
        patient = db.query(Patient).filter(Patient.user_id== user.user_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient Not Found")
        return patient.patient_id
    else:
       raise HTTPException(status_code=404, detail="Invalid Name") 


def get_patient_id_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first() 
    if not user:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    patient = db.query(Patient).filter(Patient.user_id== user.user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    return patient.patient_id

@router.get("/getAllPatients/")
def get_all_patients(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if current_user.role == "admin":
        info = []
        patient_db = db.query(Patient).all()
        for patient in patient_db:
            patient_name = get_patient_name_by_id(patient.patient_id,db)
            user = db.query(User).filter(User.user_id == patient.user_id).first() 
            if not user:
                raise HTTPException(status_code=404, detail="User Not Found")
            app_data = {"patient_id": patient.patient_id,
                        "patient_name":patient_name,
                        "username":user.username,
                        "status_expiry": patient.status_expiry,
                        "email":user.email,
                        "phone_number": user.phone_number}
            info.append(app_data)
        return info
    raise HTTPException(status_code=404, detail="Administrator Privileges are Needed")
    
def getPatientId(user_id: int, db: Session = Depends(get_db) ):
    patient = db.query(Patient).filter(Patient.user_id == user_id, Patient.is_patient == 1).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient Not Found")
    return patient.patient_id


    