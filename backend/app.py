import logging
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pickle
import pandas as pd
import json
from mpmath import mpf  



app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/flask_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)




# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Database Models
class Graph(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    dot_data_1 = db.Column(db.Text)
    pickle_data_1 = db.Column(db.Text)
    species_name = db.Column(db.Text)
    free_energy = db.Column(db.Text)






    def __repr__(self):
        return f"<PickleData {self.pickle_data}>"

    def to_dict(self):
        return {
            "id": self.id,
            "pickle_data": self.pickle_data
        }

# Helper function to extract SMILES and labels from pickle data
def extract_smiles_and_labels(pickle_data):
    """
    Extracts SMILES strings and their corresponding labels from pickle data.
    Assumes the pickle contains a dictionary with SMILES strings as keys and labels as values.
    """
    try:
        # Load pickle data
        data = pickle.load(pickle_data)
        
        # Ensure data is a dictionary with SMILES as keys and labels as values
        if not isinstance(data, dict):
            raise ValueError("Pickle data is not a dictionary.")

        smiles_labels = [{"smiles": smiles, "label": label} for smiles, label in data.items()]
        return smiles_labels

    except Exception as e:
        logger.error(f"Error extracting SMILES and labels: {str(e)}")
        return []

# Serialization function to handle complex types
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
        # Return object as is if it is JSON-serializable
        return obj

@app.route('/upload', methods=['POST'])
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


        logger.info("Files uploaded and compared successfully.")
        return jsonify({"message": "Files uploaded and compared successfully", "data": dataSerialized})

    except Exception as e:
        logger.exception("An error occurred while processing the files.")
        return jsonify({"error": f"Failed to process pickle files: {str(e)}"}), 500

@app.route('/save', methods=['POST'])
def save_data():
    """Save data sent from the front end to the database, including merged .dot files and pickle data."""
    logger.info("Received a request to save data.")
    
    try:
        dot_file_1_data = request.form.get('dot_file_1')  
        dot_file_2_data = request.form.get('dot_file_2')  
        dot_file_1_filename = request.form.get('dot_file_1_filename')  
        pickle_data = request.form.get('pickle_data')  
        
        if not dot_file_1_data or not dot_file_2_data or not dot_file_1_filename:
            logger.error("Missing required fields: 'dot_file_1', 'dot_file_2', or 'dot_file_1_filename'.")
            return jsonify({"error": "Missing required fields: 'dot_file_1', 'dot_file_2', or 'dot_file_1_filename'"}), 400

        try:
            dot_data_1 = json.loads(dot_file_1_data)  
            dot_data_2 = json.loads(dot_file_2_data)  
            pickle_data_json = json.loads(pickle_data) if pickle_data else None  
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON format in incoming data: {e}")
            return jsonify({"error": "Invalid JSON format in data."}), 400

        graph = Graph(dot_data_1=json.dumps(dot_data_1), name=dot_file_1_filename)
        db.session.add(graph)
        db.session.commit()

        subnet = Subnet(
            graph_id=graph.id,
            dot_data_2=json.dumps(dot_data_2)  
        )
        db.session.add(subnet)
        db.session.commit()

        if pickle_data_json:
            pickle_data_record = PickleData(
                subnet_id=subnet.id,
                pickle_data=json.dumps(pickle_data_json)  
            )
            db.session.add(pickle_data_record)
            db.session.commit()

        logger.info(f"Data saved successfully for graph {graph.name} and subnet {subnet.id}.")
        return jsonify({"message": "Data saved successfully"}), 200

    except Exception as e:
        logger.exception("An error occurred while saving the data.")
        return jsonify({"error": f"Failed to save data: {str(e)}"}), 500
    
@app.route('/save-data', methods=['POST'])
def save_graph_data():
    """Save nodes and edges data to the database."""
    try:
        data = request.get_json()

        extracted_data = data.get('nodes')  
        edges = data.get('edges')  
        graph_name = data.get('name', 'default_graph')  

        pickle_data = data.get("pickle_data")  
        free_energy_data = data.get("free_energy")

        dataSerialized = serialize_object(pickle_data)

        if not pickle_data:
            logger.error("No pickle_data provided in the request.")
            return jsonify({"error": "Missing 'pickle_data' in the request"}), 400

        if not free_energy_data:
            logger.error("No pickle_data provided in the request.")
            return jsonify({"error": "Missing 'pickle_data' in the request"}), 400
        


        if not extracted_data or not edges:
            return jsonify({"error": "Missing nodes or edges data"}), 400
        
        nodes = []
        for node in extracted_data:
            nodes.append({
                "id": node.get("id"),
                "type": node.get("type"),
                "moleculeID": node.get("moleculeID"),
                "smiles": node.get("smiles"),
                "formula": node.get("formula"),
                "rxnID": node.get("rxnID"),
                "level": node.get("level"),
                "rateControl": node.get("rateControl"),
                "isHighlighted": node.get("isHighlighted", [])
            })

        graph_data = {
            "extractedData": nodes,
            "edges": edges
        }

        graph = Graph(name=graph_name, dot_data_1=json.dumps(graph_data), pickle_data_1= json.dumps(dataSerialized), free_energy= json.dumps(free_energy_data))  # Saving combined nodes and edges as dot_data
        db.session.add(graph)
        db.session.commit()

        return jsonify({"message": "Graph data saved successfully", "graph_id": graph.id}), 200

    except Exception as e:
        logger.exception("Error saving graph data")
        return jsonify({"error": f"Failed to save data: {str(e)}"}), 500

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_graph(id):
    """Delete a graph by its ID, including related subnet and pickle data."""
    logger.info(f"Received a request to delete graph with ID {id}.")
    
    try:
        graph = Graph.query.get(id)
        
        if not graph:
            logger.error(f"Graph with ID {id} not found.")
            return jsonify({"error": f"Graph with ID {id} not found."}), 404
        
        
        
        db.session.delete(graph)
        
        db.session.commit()
        
        logger.info(f"Graph with ID {id} and its related data have been deleted successfully.")
        return jsonify({"message": f"Graph with ID {id} and its related data have been deleted successfully."}), 200

    except Exception as e:
        logger.exception(f"An error occurred while deleting graph with ID {id}.")
        return jsonify({"error": f"Failed to delete graph with ID {id}: {str(e)}"}), 500

@app.route('/get_all_data', methods=['GET'])
def get_all_graphs():
    """Retrieve all graph data from the database."""
    try:
        graphs = Graph.query.all()
        
        graph_list = []
        for graph in graphs:
            graph_list.append({
                "id": graph.id,
                "name": graph.name,
                "dot_data_1": json.loads(graph.dot_data_1) if graph.dot_data_1 else None,
                "pickle_data_1": json.loads(graph.pickle_data_1) if graph.pickle_data_1 else None,
                "free_energy": json.loads(graph.free_energy) if graph.free_energy else None,
            })

        logger.info("Retrieved all graphs successfully.")
        return jsonify({"graphs": graph_list, "count": len(graph_list)}), 200

    except Exception as e:
        logger.exception("Error retrieving graphs from the database.")
        return jsonify({"error": f"Failed to retrieve graphs: {str(e)}"}), 500

@app.route('/get_data_id/<int:id>', methods=['GET'])
def get_graph_by_id(id):
    """Retrieve graph data by its ID from the database."""
    try:
        graph = Graph.query.get(id)
        
        if graph is None:
            return jsonify({"error": "Graph not found"}), 404
        
        graph_data = {
            "id": graph.id,
            "name": graph.name,
            "dot_data_1": json.loads(graph.dot_data_1) if graph.dot_data_1 else None,
            "pickle_data_1": json.loads(graph.pickle_data_1) if graph.pickle_data_1 else None,
            "free_energy": json.loads(graph.free_energy) if graph.free_energy else None,
        }

        logger.info(f"Retrieved graph with ID {id} successfully.")
        return jsonify({"graph": graph_data}), 200

    except Exception as e:
        logger.exception("Error retrieving graph from the database.")
        return jsonify({"error": f"Failed to retrieve graph: {str(e)}"}), 500



if __name__ == '__main__':
    logger.info("Starting Flask app in debug mode...")
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
