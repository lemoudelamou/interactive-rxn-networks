from flask import Blueprint, request, jsonify, json
import pickle
from app.utils import extract_smiles_and_labels, serialize_object
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('upload', __name__)


@bp.route('/upload', methods=['POST'])
def upload_file():
    logger.info("Received a file upload request.")
    
    if 'file_1' not in request.files or 'file_2' not in request.files:
        logger.error("One or both pickle files are missing.")
        return jsonify({"error": "Both 'file_1' and 'file_2' are required."}), 400

    file_1 = request.files['file_1']
    file_2 = request.files['file_2']

    if file_1.filename == '' or file_2.filename == '':
        logger.error("One or both files are missing a filename.")
        return jsonify({"error": "Both files are required."}), 400

    try:
        logger.info("Processing file 1 (First Pickle File).")
        data_1 = pickle.load(file_1)
        logger.debug(f"Loaded data from file 1: {data_1}")

        logger.info("Processing file 2 (Second Pickle File).")
        smiles_labels = extract_smiles_and_labels(file_2)
        logger.debug(f"Extracted SMILES and labels from file 2: {smiles_labels}")

        dataSerialized = serialize_object(data_1)
        
        rate_control_data = dataSerialized.get("rate_control", [])
        if not rate_control_data:
            return jsonify("No rate control data found."), 400
        
        coverage_data = dataSerialized.get("coverage", [])
        if not coverage_data:
            return jsonify("No coverage data found."), 400

        tof_data = dataSerialized.get("coverage", [])
        if not tof_data:
            return jsonify("No TOF data found."), 400

        for rate_entry in rate_control_data:
            for key, value in rate_entry.items():
                for label in value.keys():
                    for smile_data in smiles_labels:
                        if smile_data["label"] == label:
                            if isinstance(value[label], dict):
                                logger.info(f"Match found for label: {label}. Adding SMILES: {smile_data['smiles']}")
                                value[label]["smiles"] = smile_data["smiles"]
                            else:
                                logger.info(f"Converting value of {label} to dictionary and adding SMILES.")
                                value[label] = {"value": value[label], "smiles": smile_data["smiles"]}

        for value in coverage_data:
            for label in value.keys():
                for smile_data in smiles_labels:
                    if smile_data["label"] == label:
                        if isinstance(value[label], dict):
                            logger.info(f"Match found for label: {label}. Adding SMILES: {smile_data['smiles']}")
                            value[label]["smiles"] = smile_data["smiles"]
                            
                        else:
                            logger.info(f"Converting value of {label} to dictionary and adding SMILES.")
                            value[label] = {"value": value[label], "smiles": smile_data["smiles"]}
        
        dataSerialized["species_name"] = serialize_object(smiles_labels)

      
        try:
            new_pickle_data = pickle.dumps(dataSerialized, protocol=pickle.HIGHEST_PROTOCOL)
        except Exception as e:
            logger.error(f"Failed to pickle data: {str(e)}")
            return jsonify({"error": f"Failed to pickle data: {str(e)}"}), 500

        

        logger.info("Files uploaded, processed, and re-pickled successfully.")
        return jsonify({"message": "Files uploaded, processed, and re-pickled successfully", "data": dataSerialized})

    except Exception as e:
        logger.exception("An error occurred while processing the files.")
        return jsonify({"error": f"Failed to process pickle files: {str(e)}"}), 500
