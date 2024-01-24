document.addEventListener("DOMContentLoaded", function () {
   attachFormSubmitListener();
   attachFormSubmitListener2();
});

function attachFormSubmitListener() {
   var form = document.getElementById("health-metrics-form");
   if (form) {
      form.addEventListener("submit", function (event) {
         event.preventDefault();
         var formData = collectFormData();
         sendFormDataToServer(formData);
      });
   } else {
      console.error("Form not found");
   }
}

function collectFormData() {
   return {
      Patient_Registration_Number: document.getElementById("Patient_Registration_Number").value,
      Race: document.getElementById("Race").value,
      Education_level: document.getElementById("Education_level").value,
      Patient_occupation: document.getElementById("Patient_occupation").value,
      Health_funding: document.getElementById("Health_funding").value,
      CR_Intake: document.getElementById("CR_Intake").value,
      Prescribed_Sessions: document.getElementById("Prescribed_Sessions").value,
      AACVPR_Risk_Category: document.getElementById("AACVPR_Risk_Category").value,
      CR_Adherence: document.getElementById("CR_Adherence").value,
      Triglyceride: document.getElementById("Triglyceride").value,
      HDL: document.getElementById("HDL").value,
      LDL: document.getElementById("LDL").value,
      HbA1c: document.getElementById("HbA1c").value,
      Pre_Tobacco: document.getElementById("Pre_Tobacco").value,
      Post_Tobacco: document.getElementById("Post_Tobacco").value,
      Pre_Weight: document.getElementById("Pre_Weight").value,
      Post_Weight: document.getElementById("Post_Weight").value,
      Height: document.getElementById("Height").value,
      Pre_Exercise_Stress_Test: document.getElementById("Pre_Exercise_Stress_Test").value,
      Pre_Peak_Heart_Rate: document.getElementById("Pre_Peak_Heart_Rate").value,
      Pre_METs: document.getElementById("Pre_METs").value,
      Post_Exercise_Stress_Test: document.getElementById("Post_Exercise_Stress_Test").value,
      Post_Peak_Heart_Rate: document.getElementById("Post_Peak_Heart_Rate").value,
      Post_Peak_METs: document.getElementById("Post_Peak_METs").value,
      Exercise_frequency_mins_week: document.getElementById("Exercise_frequency_mins_week").value,
      Exercise_frequency_sessions_week: document.getElementById("Exercise_frequency_sessions_week").value,
      Exercise_intensity: document.getElementById("Exercise_intensity").value,
      Anxiety_Scores: document.getElementById("Anxiety_Scores").value,
      Depression_Scores: document.getElementById("Depression_Scores").value,
      Pre_RTW: document.getElementById("Pre_RTW").value,
      Post_RTW: document.getElementById("Post_RTW").value,
      Pre_Return_to_drive: document.getElementById("Pre_Return_to_drive").value,
      Post_Return_to_drive: document.getElementById("Post_Return_to_drive").value,
      Pre_erectile_dysfunction: document.getElementById("Pre_erectile_dysfunction").value,
      Post_erectile_dysfunction: document.getElementById("Post_erectile_dysfunction").value,
      MACCE: document.getElementById("MACCE").value,
      Unexpected_Events: document.getElementById("Unexpected_Events").value,
      Residential_Postcode: document.getElementById("Residential_Postcode").value,
      Age: document.getElementById("Age").value,
      Gender: document.getElementById("Gender").value,
      Pre_Left_Ventricle_EF: document.getElementById("Pre_Left_Ventricle_EF").value,
      Admission_Diagnosis_Angina: document.getElementById("Admission_Diagnosis_Angina").value,
      Admission_Diagnosis_Arrhythmia: document.getElementById("Admission_Diagnosis_Arrhythmia").value,
      Admission_Diagnosis_CABG: document.getElementById("Admission_Diagnosis_CABG").value,
      Admission_Diagnosis_Heart_Failure: document.getElementById("Admission_Diagnosis_Heart_Failure").value,
      Admission_Diagnosis_NSTEMI: document.getElementById("Admission_Diagnosis_NSTEMI").value,
      Admission_Diagnosis_Other_cardiothoracic_procedures: document.getElementById("Admission_Diagnosis_Other_cardiothoracic_procedures").value,
      Admission_Diagnosis_PCI: document.getElementById("Admission_Diagnosis_PCI").value,
      Admission_Diagnosis_STEMI: document.getElementById("Admission_Diagnosis_STEMI").value,
      Admission_Diagnosis_Valve_replacement: document.getElementById("Admission_Diagnosis_Valve_replacement").value,
      Risk_Factors_DM_Type_2: document.getElementById("Risk_Factors_DM_Type_2").value,
      Risk_Factors_High_Lipid_Profile: document.getElementById("Risk_Factors_High_Lipid_Profile").value,
      Risk_Factors_Hypertension: document.getElementById("Risk_Factors_Hypertension").value,
      Risk_Factors_None_of_the_above: document.getElementById("Risk_Factors_None_of_the_above").value,
      Risk_Factors_Unknown: document.getElementById("Risk_Factors_Unknown").value,
      Total_Risk_Factors: document.getElementById("Total_Risk_Factors").value,
      Past_CV_Chronic_AF: document.getElementById("Past_CV_Chronic_AF").value,
      Past_CV_Hx_of_HF: document.getElementById("Past_CV_Hx_of_HF").value,
      Past_CV_Implantable_Cardiac_Defibrillator: document.getElementById("Past_CV_Implantable_Cardiac_Defibrillator").value,
      Past_CV_None_of_the_above: document.getElementById("Past_CV_None of the above").value,
      Past_CV_Prev_CABG: document.getElementById("Past_CV_Prev_CABG").value,
      Past_CV_Prev_MI: document.getElementById("Past_CV_Prev_MI").value,
      Past_CV_Prev_PCI: document.getElementById("Past_CV_Prev_PCI").value,
      Past_CV_Prev_Valve_Surgery: document.getElementById("Past_CV_Prev_Valve_Surgery").value,
      Past_CV_Unknown: document.getElementById("Past_CV_Unknown").value,
      Triglyceride_cat: document.getElementById("Triglyceride_cat").value,
      HDL_cat: document.getElementById("HDL_cat").value,
      LDL_cat: document.getElementById("LDL_cat").value,
      HbA1c_cat: document.getElementById("HbA1c_cat").value,
      Pre_BP_systolic: document.getElementById("Pre_BP_systolic").value,
      Pre_BP_diastolic: document.getElementById("Pre_BP_diastolic").value,
      Pre_BP_cat: document.getElementById("Pre_BP_cat").value,
      CR_BP_systolic: document.getElementById("CR_BP_systolic").value,
      CR_BP_diastolic: document.getElementById("CR_BP_diastolic").value,
      CR_BP_cat: document.getElementById("CR_BP_cat").value,
      postal_code: document.getElementById("postal_code").value,
      place_name: document.getElementById("place_name").value,
      state_name: document.getElementById("state_name").value,
      latitude: document.getElementById("latitude").value,
      longitude: document.getElementById("longitude").value,
      Pre_Medication_ACEI_ARB: document.getElementById("Pre_Medication_ACEI_ARB").value,
      Pre_Medication_Aspirin: document.getElementById("Pre_Medication_Aspirin").value,
      Pre_Medication_Beta_antagonist: document.getElementById("Pre_Medication_Beta_antagonist").value,
      Pre_Medication_Statin: document.getElementById("Pre_Medication_Statin").value,
      Post_Medication_ACEI_ARB: document.getElementById("Post_Medication_ACEI_ARB").value,
      Post_Medication_Aspirin: document.getElementById("Post_Medication_Aspirin").value,
      Post_Medication_Beta_antagonist: document.getElementById("Post_Medication_Beta_antagonist").value,
      Post_Medication_Statin: document.getElementById("Post_Medication_Statin").value,
      CR_Medication_ACEI_ARB: document.getElementById("CR_Medication_ACEI_ARB").value,
      CR_Medication_Aspirin: document.getElementById("CR_Medication_Aspirin").value,
      CR_Medication_Beta_antagonist: document.getElementById("CR_Medication_Beta_antagonist").value,
      CR_Medication_Statin: document.getElementById("CR_Medication_Statin").value,
      CR_Completion: document.getElementById("CR_Completion").value,
      Duration_Between_Ward_Enrollment: document.getElementById("Duration_Between_Ward_Enrollment").value,
      Duration_CR: document.getElementById("Duration_CR").value,
      Pre_BMI: document.getElementById("Pre_BMI").value,
      Post_BMI: document.getElementById("Post_BMI").value,
      Pre_BMI_range: document.getElementById("Pre_BMI_range").value,
      Post_BMI_range: document.getElementById("Post_BMI_range").value,
      Pre_Peak_Heart_Rate_range: document.getElementById("Pre_Peak_Heart_Rate_range").value,
      Post_Peak_Heart_Rate_range: document.getElementById("Post_Peak_Heart_Rate_range").value,
      Pre_METs_range: document.getElementById("Pre_METs_range").value,
      Post_Peak_METs_range: document.getElementById("Post_Peak_METs_range").value,

      // Add other form fields here
   };
}

function sendFormDataToServer(formData) {
   console.log("Sending Data:", JSON.stringify(formData));
   fetch("/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
   })
      .then((response) => {
         if (!response.ok) {
            throw new Error("Network response was not ok: " + response.statusText);
         }
         return response.json();
      })
      .then((data) => {
         console.log("Success:", data);
         location.href = "/";
      })
      .catch((error) => {
         console.error("Error:", error);
      });
}

function attachFormSubmitListener2() {
   var form = document.getElementById("file-upload-form");
   if (form) {
      form.addEventListener("submit", function (e) {
         e.preventDefault(); // Prevent the default form submission
         var formData = new FormData(this);
         fetch("/upload-file", {
            method: "POST",
            body: formData,
         })
            .then((response) => response.json())
            .then((data) => {
               // If the response contains data, populate the fields
               if (data && data.length > 0) {
                  populateFormFields(data[0]); // Assuming you want to populate with the first record
               } else {
                  console.error("No data received");
               }
            })
            .catch((error) => console.error("Error:", error));
      });
   } else {
      console.error("Form not found");
   }
}

function populateFormFields(data) {
   // Iterate over each key in the data object
   for (var key in data) {
      // Ensure the key actually exists in the data
      if (data.hasOwnProperty(key)) {
         var inputField = document.getElementById(key);
         if (inputField) {
            inputField.value = data[key];
         }
      }
   }
}
