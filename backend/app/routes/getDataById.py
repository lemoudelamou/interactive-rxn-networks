from flask import Blueprint, jsonify, json
from app.models import Graph
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('getDataById', __name__)

@bp.route('/get_data_id/<int:id>', methods=['GET'])
def get_graph_by_id(id):
    """Retrieve graph data by its ID from the database."""
    try:
        graph = Graph.query.get(id)
        
        if graph is None:
            return jsonify({"error": "Graph not found"}), 404
        
        graph_data = {
            "id": graph.id,
            "name": graph.name,
            "dot_data_1": json.loads(graph.graph_data) if graph.graph_data else None,
            "pickle_data_1": json.loads(graph.attributes) if graph.attributes else None,
            "free_energy": json.loads(graph.free_energy) if graph.free_energy else None,
        }

        logger.info(f"Retrieved graph with ID {id} successfully.")
        return jsonify({"graph": graph_data}), 200

    except Exception as e:
        logger.exception("Error retrieving graph from the database.")
        return jsonify({"error": f"Failed to retrieve graph: {str(e)}"}), 500

