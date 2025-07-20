import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
import re

def clean_col_names(df):
    cols = df.columns
    new_cols = []
    for col in cols:
        new_col = re.sub(r'[^a-zA-Z0-9_]', '', col.strip().replace(' ', '_'))
        new_cols.append(new_col)
    df.columns = new_cols
    return df

def train_and_save_model(data_path, target_column, model_filename):
    df = pd.read_csv(data_path)
    df = clean_col_names(df)

    cleaned_target_column = re.sub(r'[^a-zA-Z0-9_]', '', target_column.strip().replace(' ', '_'))

    # Drop rows with missing values in target column
    df.dropna(subset=[cleaned_target_column], inplace=True)

    # Select features (excluding non-numeric and target columns)
    features = [col for col in df.columns if col not in [cleaned_target_column, 'created_at', 'entry_id'] and df[col].dtype != 'object']
    X = df[features]
    y = df[cleaned_target_column]

    # Handle potential NaN values in features by filling with mean
    X = X.fillna(X.mean())

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    joblib.dump(model, model_filename)
    print(f"Model for {target_column} saved to {model_filename}")

    # Evaluate model (optional, for verification)
    score = model.score(X_test, y_test)
    print(f"Model score for {target_column}: {score}")


if __name__ == "__main__":
    data_dir = "/home/Users/data"
    # Train models for each relevant target variable across all datasets
    target_variables = ["Temperature (C)", "Turbidity(NTU)", "Dissolved Oxygen(g/ml)", "PH", "Ammonia(g/ml)", "Nitrate(g/ml)", "Fish_Length(cm)", "Fish_Weight(g)"]

    for filename in os.listdir(data_dir):
        if filename.endswith(".csv"):
            data_path = os.path.join(data_dir, filename)
            print(f"Processing {filename}...")
            for target_var in target_variables:
                model_name = f"random_forest_{re.sub(r'[^a-zA-Z0-9_]', '', target_var.strip().replace(' ', '_'))}_{filename.replace('.csv', '')}.joblib"
                try:
                    train_and_save_model(data_path, target_var, model_name)
                except KeyError as e:
                    print(f"Skipping {target_var} in {filename}: {e}")
                except Exception as e:
                    print(f"An error occurred while processing {target_var} in {filename}: {e}")


