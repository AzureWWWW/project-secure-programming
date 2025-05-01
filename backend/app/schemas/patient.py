from datetime import datetime
from app.schemas.user import UserCreate, UserUpdate

class PatientUser(UserCreate):
    user_id: int
    
class AdminUpdatePatient(UserUpdate):
    status_expiry : datetime = None