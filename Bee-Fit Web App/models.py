# models.py

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base

# Define your engine here
engine = create_engine("sqlite:///database/beefit.db")
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    # Replace these with your actual column names and types
    Patient_Registration_Number = Column(Integer, primary_key=True)
    Race = Column(String)
    Education_level = Column(String)
    Patient_occupation = Column(String)
    Health_funding = Column(String)
    CR_Intake = Column(String)
    Prescribed_Sessions = Column(String)
    AACVPR_Risk_Category = Column(String)
    CR_Adherence = Column(String)
    Triglyceride = Column(Integer)
    HDL = Column(Float)
    LDL = Column(Float)
    HbA1c = Column(Float)
    Pre_Tobacco = Column(String)
    Post_Tobacco = Column(String)
    Pre_Weight = Column(Float)
    Post_Weight = Column(Float)
    Height = Column(Float)
    Pre_Exercise_Stress_Test = Column(String)
    Pre_Peak_Heart_Rate = Column(Integer)
    Pre_METs = Column(Float)
    Post_Exercise_Stress_Test = Column(String)
    Post_Peak_Heart_Rate = Column(Integer)
    Post_Peak_METs = Column(Float)
    Exercise_frequency_mins_week = Column(Integer)
    Exercise_frequency_sessions_week = Column(Integer)
    Exercise_intensity = Column(Integer)
    Anxiety_Scores = Column(Integer)
    Depression_Scores = Column(Integer)
    Pre_RTW = Column(Integer)
    Post_RTW = Column(Integer)
    Pre_Return_to_drive = Column(Integer)
    Post_Return_to_drive = Column(Integer)
    Pre_erectile_dysfunction = Column(Integer)
    Post_erectile_dysfunction = Column(Integer)
    MACCE = Column(Integer)
    Unexpected_Events = Column(Integer)
    Residential_Postcode = Column(Integer)
    Age = Column(Integer)
    Gender = Column(String)
    Pre_Left_Ventricle_EF = Column(Integer)
    Admission_Diagnosis_Angina = Column(Integer)
    Admission_Diagnosis_Arrhythmia = Column(Integer)
    Admission_Diagnosis_CABG = Column(Integer)
    Admission_Diagnosis_Heart_Failure = Column(Integer)
    Admission_Diagnosis_NSTEMI = Column(Integer)
    Admission_Diagnosis_Other_cardiothoracic_procedures = Column(Integer)
    Admission_Diagnosis_PCI = Column(Integer)
    Admission_Diagnosis_STEMI = Column(Integer)
    Admission_Diagnosis_Valve_replacement = Column(Integer)
    Risk_Factors_DM_Type_2 = Column(Integer)
    Risk_Factors_High_Lipid_Profile = Column(Integer)
    Risk_Factors_Hypertension = Column(Integer)
    Risk_Factors_None_of_the_above = Column(Integer)
    Risk_Factors_Unknown = Column(Integer)
    Total_Risk_Factors = Column(Integer)
    Past_CV_Chronic_AF = Column(Integer)
    Past_CV_Hx_of_HF = Column(Integer)
    Past_CV_Implantable_Cardiac_Defibrillator = Column(Integer)
    Past_CV_None_of_the_above = Column(Integer)
    Past_CV_Prev_CABG = Column(Integer)
    Past_CV_Prev_MI = Column(Integer)
    Past_CV_Prev_PCI = Column(Integer)
    Past_CV_Prev_Valve_Surgery = Column(Integer)
    Past_CV_Unknown = Column(Integer)
    Triglyceride_cat = Column(String)
    HDL_cat = Column(String)
    LDL_cat = Column(String)
    HbA1c_cat = Column(String)
    Pre_BP_systolic = Column(Integer)
    Pre_BP_diastolic = Column(Integer)
    Pre_BP_cat = Column(String)
    CR_BP_systolic = Column(Integer)
    CR_BP_diastolic = Column(Integer)
    CR_BP_cat = Column(String)
    postal_code = Column(Integer)
    place_name = Column(String)
    state_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    Pre_Medication_ACEI_ARB = Column(Integer)
    Pre_Medication_Aspirin = Column(Integer)
    Pre_Medication_Beta_antagonist = Column(Integer)
    Pre_Medication_Statin = Column(Integer)
    Post_Medication_ACEI_ARB = Column(Integer)
    Post_Medication_Aspirin = Column(Integer)
    Post_Medication_Beta_antagonist = Column(Integer)
    Post_Medication_Statin = Column(Integer)
    CR_Medication_ACEI_ARB = Column(Integer)
    CR_Medication_Aspirin = Column(Integer)
    CR_Medication_Beta_antagonist = Column(Integer)
    CR_Medication_Statin = Column(Integer)
    CR_Completion = Column(String)
    Duration_Between_Ward_Enrollment = Column(Integer)
    Duration_CR = Column(Integer)
    Pre_BMI = Column(Float)
    Post_BMI = Column(Float)
    Pre_BMI_range = Column(String)
    Post_BMI_range = Column(String)
    Pre_Peak_Heart_Rate_range = Column(String)
    Post_Peak_Heart_Rate_range = Column(String)
    Pre_METs_range = Column(String)
    Post_Peak_METs_range = Column(String)

    Height_Score = Column(Integer, default=0)

    def __repr__(self) -> str:
        return f"UserData(Patient_Registration_Number={self.Patient_Registration_Number!r}, Race={self.Race!r}, Education_level={self.Education_level!r})"

    def to_dict(self):
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        }
