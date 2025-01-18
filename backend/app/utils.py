import pickle
import pandas as pd
from mpmath import mpf


def extract_smiles_and_labels(pickle_data):
    """
    Extracts SMILES strings and their corresponding labels from pickle data.
    Assumes the pickle contains a dictionary with SMILES strings as keys and labels as values.
    """
    try:
        data = pickle.load(pickle_data)
        
        if not isinstance(data, dict):
            raise ValueError("Pickle data is not a dictionary.")

        smiles_labels = [{"smiles": smiles, "label": label} for smiles, label in data.items()]
        return smiles_labels

    except Exception as e:
        return []

def serialize_object(obj):
    """Recursively serialize objects, ensuring mpf and other non-serializable types are handled."""
    if isinstance(obj, pd.DataFrame):
        return [
            {str(index): serialize_object(row.to_dict())} for index, row in obj.iterrows()
        ]
    elif isinstance(obj, pd.Series):
        return [{str(idx): serialize_object(value)} for idx, value in obj.items()]
    elif isinstance(obj, dict):
        return {key: serialize_object(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_object(item) for item in obj]
    elif isinstance(obj, tuple):
        return [serialize_object(item) for item in obj]
    elif isinstance(obj, set):
        return [serialize_object(item) for item in obj]
    elif isinstance(obj, mpf):
        # Convert mpmath 'mpf' to float
        return float(obj)
    else:
        return obj
