from flask import Blueprint, request, jsonify, json
from app.models import Graph
from app import db
import logging
from app.utils import serialize_object


logger = logging.getLogger(__name__)
bp = Blueprint('save-data', __name__)

@bp.route('/save-data', methods=['POST'])
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

        graph = Graph(name=graph_name, graph_data=json.dumps(graph_data), attributes= json.dumps(dataSerialized), free_energy= json.dumps(free_energy_data))  # Saving combined nodes and edges as dot_data
        db.session.add(graph)
        db.session.commit()

        return jsonify({"message": "Graph data saved successfully", "graph_id": graph.id}), 200

    except Exception as e:
        logger.exception("Error saving graph data")
        return jsonify({"error": f"Failed to save data: {str(e)}"}), 500

