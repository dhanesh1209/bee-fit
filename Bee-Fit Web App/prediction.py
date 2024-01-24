# %%
# Importing all Library
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)
from sklearn.model_selection import GridSearchCV
from imblearn.over_sampling import SMOTE
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

dataset = pd.read_csv("./data_files/CR_Data_Cleaned_V3.csv")


def map_intensity(value):
    if pd.isnull(value):
        return np.nan  # Keeps null values as null
    elif value in [1, 2]:
        return "Low Intensity"
    elif value in [3, 4]:
        return "Moderate Intensity"
    elif value in [5, 6]:
        return "Moderately High Intensity"
    elif value in [7, 8]:
        return "High Intensity"


def predict_level(user_data):
    # SECTION  Training Phase
    dataset["Exercise_intensityNew"] = dataset["Exercise_intensity"].apply(
        map_intensity
    )
    dataset["Race"].replace(
        ["Others", "Chinese", "Malay", "Indian", "Unknown"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    dataset["Education_level"].replace(
        [
            "Form 6 / pre-university graduate",
            "Unknown",
            "College/university graduate",
            "Some secondary education",
            "Form 5 graduate",
            "Std 6 or less",
            "Post-graduate",
            "Technical graduate",
        ],
        [0, 1, 2, 3, 4, 5, 6, 7],
        inplace=True,
    )
    dataset["Patient_occupation"].replace(
        [
            "Government servant",
            "Self-employed (excludes housewives)",
            "Private employment",
        ],
        [0, 1, 2],
        inplace=True,
    )
    dataset["Health_funding"].replace(
        ["Fully Funded", "Self funded", "Semi-Funded"], [0, 1, 2], inplace=True
    )
    dataset["CR_Intake"].replace(["Yes", "No"], [0, 1], inplace=True)
    dataset["Prescribed_Sessions"].replace(
        ["8 weeks", "> 8 weeks", "Did Not Enroll CR", "6 weeks"],
        [0, 1, 2, 3],
        inplace=True,
    )
    dataset["AACVPR_Risk_Category"].replace(
        ["Low", "Intermediate", "High", "Did Not Enroll CR", "Unknown"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    dataset["CR_Adherence"].replace(
        ["Yes", "Did Not Enroll CR", "No"], [0, 1, 2], inplace=True
    )
    dataset["Pre_Tobacco"].replace(
        ["Never smoked", "Former smoker", "Current smoker"], [0, 1, 2], inplace=True
    )
    dataset["Post_Tobacco"].replace(
        ["nan", "Abstaining", "Unknown", "Not Abstaining"], [3, 0, 1, 2], inplace=True
    )
    dataset["Pre_Exercise_Stress_Test"].replace(
        ["Treadmill", "6MWT only", "Arm Ergo"], [0, 1, 2], inplace=True
    )
    dataset["Post_Exercise_Stress_Test"].replace(
        ["Treadmill", "6MWT only", "Arm Ergo", "nan"], [0, 1, 2, 3], inplace=True
    )
    dataset["Gender"].replace(["Female", "Male"], [0, 1], inplace=True)
    dataset["Pre_Left_Ventricle_EF"].replace(
        [
            "nan",
            "more then 50% with no failure symptoms",
            "less then 40%",
            "between 40 to 50%",
        ],
        [3, 0, 1, 2],
        inplace=True,
    )
    dataset["Triglyceride_cat"].replace(
        ["Normal", "High", "Borderline high", "Very High", "nan"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    dataset["HDL_cat"].replace(
        ["Intermediate risk", "High Risk", "Low risk", "nan"],
        [0, 1, 2, 3],
        inplace=True,
    )
    dataset["LDL_cat"].replace(
        ["Intermediate risk", "Low Risk", "High risk", "nan"],
        [0, 1, 2, 3],
        inplace=True,
    )
    dataset["HbA1c_cat"].replace(
        ["Normal", "Prediabetes", "Diabetes", "nan"], [0, 1, 2, 3], inplace=True
    )
    dataset["Pre_BP_cat"].replace(
        [
            "Optimal",
            "Isolated Systolic Hypertension",
            "At Risk",
            "Normal",
            "Hypertension Stage 1",
            "Hypertension Stage 2",
            "nan",
            "Hypertension Stage 3",
        ],
        [0, 1, 2, 3, 4, 5, 6, 7],
        inplace=True,
    )
    dataset["CR_BP_cat"].replace(
        [
            "Optimal",
            "Normal",
            "Isolated Systolic Hypertension",
            "At Risk",
            "nan",
            "Hypertension Stage 1",
        ],
        [0, 1, 2, 3, 4, 5],
        inplace=True,
    )
    dataset["CR_Completion"].replace(
        ["Yes", "Did not enroll to CR", "No"], [0, 1, 2], inplace=True
    )
    dataset["Pre_BMI_range"].replace(
        ["Normal", "Obesity", "Overweight", "nan", "Underweight"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    dataset["Post_BMI_range"].replace(
        ["Normal", "Obesity", "Overweight", "nan", "Underweight"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    dataset["Pre_Peak_Heart_Rate_range"].replace(
        ["Moderate", "nan", "Hard", "Light", "Very Light", "Very Hard"],
        [0, 1, 2, 3, 4, 5],
        inplace=True,
    )
    dataset["Post_Peak_Heart_Rate_range"].replace(
        ["nan", "Very Light", "Very Hard", "Hard", "Moderate", "Light"],
        [1, 4, 5, 2, 0, 3],
        inplace=True,
    )
    dataset["Pre_METs_range"].replace(
        ["Vigorous Intensity", "Moderate Intensity", "Light Intensity", "nan"],
        [0, 1, 2, 3],
        inplace=True,
    )
    dataset["Post_Peak_METs_range"].replace(
        ["nan", "Vigorous Intensity", "Moderate Intensity", "Light Intensity"],
        [3, 0, 1, 2],
        inplace=True,
    )
    dataset["place_name"].replace(
        [
            "nan",
            "Klang",
            "Sungai Buloh",
            "Kuala Lumpur, Pandan",
            "Kuala Lumpur",
            "Petaling Jaya",
            "Subang Jaya",
            "Kuala Lumpur, Gombak",
            "Dong",
            "Puchong, Sungai Buloh",
            "Seremban",
            "Kuala Selangor",
            "Kuala Terengganu",
            "Ampang",
            "Shah Alam",
            "Chini",
            "Subang Jaya, Petaling Jaya",
            "Seri Kembangan",
            "Telok Panglima Garang",
            "Batu Caves, Batu Caves",
            "Kuala Lumpur, Cheras",
            "Pelabuhan Klang",
            "Miri",
            "Hulu Langat",
            "Nilai",
            "Kuala Lumpur, Setapak",
            "Semenyih",
            "Ipoh",
            "Melaka",
            "Puchong",
            "Rawang",
            "Rawang, Batu Arang",
            "Kajang",
        ],
        [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
        ],
        inplace=True,
    )

    # Assuming dataset is your DataFrame
    dataset["state_name"].replace(
        [
            np.nan,
            "Selangor",
            "Kuala Lumpur",
            "Pahang",
            "Negeri Sembilan",
            "Terengganu",
            "Sarawak",
            "Perak",
            "Melaka",
        ],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        inplace=True,
    )
    dataset["Exercise_intensityNew"].replace(
        {
            np.nan: np.nan,  # Keeps null values as null
            "Low Intensity": 1,
            "Moderate Intensity": 2,
            "Moderately High Intensity": 3,
            "High Intensity": 4,
        },
        inplace=True,
    )

    # Calculate the mean of the numeric columns, ignoring non-numeric ones
    numeric_means = dataset.select_dtypes(include=[np.number]).mean()

    # Perform mean imputation for all numeric columns except 'Exercise_intensityNew'
    columns_to_impute = dataset.columns.difference(["Exercise_intensityNew"])
    dataset[columns_to_impute] = dataset[columns_to_impute].fillna(numeric_means)

    # Calculate the mode for the 'Exercise_intensityNew' column
    mode_imputer = SimpleImputer(strategy="most_frequent")
    dataset["Exercise_intensityNew"] = mode_imputer.fit_transform(
        dataset[["Exercise_intensityNew"]]
    )

    # Convert 'Exercise_intensityNew' to integer type
    dataset["Exercise_intensityNew"] = dataset["Exercise_intensityNew"].astype(int)

    X = dataset.drop(["Exercise_intensity", "Exercise_intensityNew"], axis=1)
    y = dataset["Exercise_intensityNew"] - 1

    smote = SMOTE(random_state=42)

    scaler = StandardScaler()

    X_resampled, y_resampled = smote.fit_resample(X, y)

    X_normalized = scaler.fit_transform(X_resampled)

    X_resampled = pd.DataFrame(X_normalized, columns=X.columns)

    # Perform train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_resampled, y_resampled, test_size=0.2, random_state=42
    )

    svm_classifier = SVC(kernel="linear", C=1.0)

    svm_classifier.fit(X_train, y_train)

    # Grid Search based SVM
    param_grid = {
        "C": [0.1, 1, 10, 100],
        "kernel": ["linear", "rbf", "poly", "sigmoid"],
    }

    svm_classifier = SVC()

    grid_search = GridSearchCV(svm_classifier, param_grid, cv=5, scoring="accuracy")
    grid_search.fit(X_train, y_train)

    best_params = grid_search.best_params_
    print("Best Parameters:", best_params)
    print("Best Parameters:", best_params)

    svm_classifier = SVC(**best_params)
    svm_classifier.fit(X_train, y_train)

    y_pred = svm_classifier.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy:", accuracy)
    print("Classification Report:\n", classification_report(y_test, y_pred))

    # SECTION Prediction Phase
    # input_data = pd.read_csv("./data_files/CR_Data_Cleaned_V3_Sample.csv")

    del user_data["Height_Score"]
    data = [user_data]
    input_data = pd.DataFrame.from_records(data)

    print(input_data)

    input_data["Exercise_intensityNew"] = input_data["Exercise_intensity"].apply(
        map_intensity
    )
    input_data["Race"].replace(
        ["Others", "Chinese", "Malay", "Indian", "Unknown"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    input_data["Education_level"].replace(
        [
            "Form 6 / pre-university graduate",
            "Unknown",
            "College/university graduate",
            "Some secondary education",
            "Form 5 graduate",
            "Std 6 or less",
            "Post-graduate",
            "Technical graduate",
        ],
        [0, 1, 2, 3, 4, 5, 6, 7],
        inplace=True,
    )
    input_data["Patient_occupation"].replace(
        [
            "Government servant",
            "Self-employed (excludes housewives)",
            "Private employment",
        ],
        [0, 1, 2],
        inplace=True,
    )
    input_data["Health_funding"].replace(
        ["Fully Funded", "Self funded", "Semi-Funded"], [0, 1, 2], inplace=True
    )
    input_data["CR_Intake"].replace(["Yes", "No"], [0, 1], inplace=True)
    input_data["Prescribed_Sessions"].replace(
        ["8 weeks", "> 8 weeks", "Did Not Enroll CR", "6 weeks"],
        [0, 1, 2, 3],
        inplace=True,
    )
    input_data["AACVPR_Risk_Category"].replace(
        ["Low", "Intermediate", "High", "Did Not Enroll CR", "Unknown"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    input_data["CR_Adherence"].replace(
        ["Yes", "Did Not Enroll CR", "No"], [0, 1, 2], inplace=True
    )
    input_data["Pre_Tobacco"].replace(
        ["Never smoked", "Former smoker", "Current smoker"], [0, 1, 2], inplace=True
    )
    input_data["Post_Tobacco"].replace(
        ["nan", "Abstaining", "Unknown", "Not Abstaining"], [3, 0, 1, 2], inplace=True
    )
    input_data["Pre_Exercise_Stress_Test"].replace(
        ["Treadmill", "6MWT only", "Arm Ergo"], [0, 1, 2], inplace=True
    )
    input_data["Post_Exercise_Stress_Test"].replace(
        ["Treadmill", "6MWT only", "Arm Ergo", "nan"], [0, 1, 2, 3], inplace=True
    )
    input_data["Gender"].replace(["Female", "Male"], [0, 1], inplace=True)
    input_data["Pre_Left_Ventricle_EF"].replace(
        [
            "nan",
            "more then 50% with no failure symptoms",
            "less then 40%",
            "between 40 to 50%",
        ],
        [3, 0, 1, 2],
        inplace=True,
    )
    input_data["Triglyceride_cat"].replace(
        ["Normal", "High", "Borderline high", "Very High", "nan"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    input_data["HDL_cat"].replace(
        ["Intermediate risk", "High Risk", "Low risk", "nan"],
        [0, 1, 2, 3],
        inplace=True,
    )
    input_data["LDL_cat"].replace(
        ["Intermediate risk", "Low Risk", "High risk", "nan"],
        [0, 1, 2, 3],
        inplace=True,
    )
    input_data["HbA1c_cat"].replace(
        ["Normal", "Prediabetes", "Diabetes", "nan"], [0, 1, 2, 3], inplace=True
    )
    input_data["Pre_BP_cat"].replace(
        [
            "Optimal",
            "Isolated Systolic Hypertension",
            "At Risk",
            "Normal",
            "Hypertension Stage 1",
            "Hypertension Stage 2",
            "nan",
            "Hypertension Stage 3",
        ],
        [0, 1, 2, 3, 4, 5, 6, 7],
        inplace=True,
    )
    input_data["CR_BP_cat"].replace(
        [
            "Optimal",
            "Normal",
            "Isolated Systolic Hypertension",
            "At Risk",
            "nan",
            "Hypertension Stage 1",
        ],
        [0, 1, 2, 3, 4, 5],
        inplace=True,
    )
    input_data["CR_Completion"].replace(
        ["Yes", "Did not enroll to CR", "No"], [0, 1, 2], inplace=True
    )
    input_data["Pre_BMI_range"].replace(
        ["Normal", "Obesity", "Overweight", "nan", "Underweight"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    input_data["Post_BMI_range"].replace(
        ["Normal", "Obesity", "Overweight", "nan", "Underweight"],
        [0, 1, 2, 3, 4],
        inplace=True,
    )
    input_data["Pre_Peak_Heart_Rate_range"].replace(
        ["Moderate", "nan", "Hard", "Light", "Very Light", "Very Hard"],
        [0, 1, 2, 3, 4, 5],
        inplace=True,
    )
    input_data["Post_Peak_Heart_Rate_range"].replace(
        ["nan", "Very Light", "Very Hard", "Hard", "Moderate", "Light"],
        [1, 4, 5, 2, 0, 3],
        inplace=True,
    )
    input_data["Pre_METs_range"].replace(
        ["Vigorous Intensity", "Moderate Intensity", "Light Intensity", "nan"],
        [0, 1, 2, 3],
        inplace=True,
    )
    input_data["Post_Peak_METs_range"].replace(
        ["nan", "Vigorous Intensity", "Moderate Intensity", "Light Intensity"],
        [3, 0, 1, 2],
        inplace=True,
    )
    input_data["place_name"].replace(
        [
            "nan",
            "Klang",
            "Sungai Buloh",
            "Kuala Lumpur, Pandan",
            "Kuala Lumpur",
            "Petaling Jaya",
            "Subang Jaya",
            "Kuala Lumpur, Gombak",
            "Dong",
            "Puchong, Sungai Buloh",
            "Seremban",
            "Kuala Selangor",
            "Kuala Terengganu",
            "Ampang",
            "Shah Alam",
            "Chini",
            "Subang Jaya, Petaling Jaya",
            "Seri Kembangan",
            "Telok Panglima Garang",
            "Batu Caves, Batu Caves",
            "Kuala Lumpur, Cheras",
            "Pelabuhan Klang",
            "Miri",
            "Hulu Langat",
            "Nilai",
            "Kuala Lumpur, Setapak",
            "Semenyih",
            "Ipoh",
            "Melaka",
            "Puchong",
            "Rawang",
            "Rawang, Batu Arang",
            "Kajang",
        ],
        [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
        ],
        inplace=True,
    )
    # Assuming input_data is your DataFrame
    input_data["state_name"].replace(
        [
            "nan",
            "Selangor",
            "Kuala Lumpur",
            "Pahang",
            "Negeri Sembilan",
            "Terengganu",
            "Sarawak",
            "Perak",
            "Melaka",
        ],
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        inplace=True,
    )
    input_data["Exercise_intensityNew"].replace(
        [
            "Unknown",
            "Low Intensity",
            "Moderate Intensity",
            "Moderately High Intensity",
            "High Intensity",
        ],
        [0, 1, 2, 3, 4],
        inplace=True,
    )

    # Impute missing values if necessary
    columns_to_impute = input_data.columns.difference(["Exercise_intensityNew"])
    input_data[columns_to_impute] = input_data[columns_to_impute].fillna(numeric_means)

    # Standardize the features using the same scaler used in training
    # Note: Use the scaler that was fitted on the training data
    X_normalized = scaler.transform(
        input_data.drop(["Exercise_intensity", "Exercise_intensityNew"], axis=1)
    )

    # Predict using the trained SVM classifier
    predicted_numerical_intensity = svm_classifier.predict(X_normalized)

    # Map the prediction to the corresponding intensity and then to game difficulty
    intensity_mapping = {
        1: "Low Intensity",
        2: "Moderate Intensity",
        3: "Moderately High Intensity",
        4: "High Intensity",
    }
    predicted_intensity = intensity_mapping.get(
        predicted_numerical_intensity[0], "Unknown"
    )

    def map_to_game_difficulty(predicted_intensity):
        mapping = {
            "Low Intensity": "Easy",
            "Moderate Intensity": "Medium",
            "Moderately High Intensity": "Hard",
            "High Intensity": "Expert",
            "Unknown": "Medium",  # Default to 'Medium' if the intensity is unknown
        }
        return mapping.get(predicted_intensity, "Unknown Difficulty")

    game_difficulty = map_to_game_difficulty(predicted_intensity)
    print(f"Predicted Game Difficulty: {game_difficulty}")

    return game_difficulty
