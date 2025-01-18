from flask import Blueprint, jsonify, json
from app.models import Graph
from app import db
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('getAllData', __name__)

@bp.route('/get_all_data', methods=['GET'])
def get_all_graphs():
    """Retrieve all graph data from the database."""
    try:
        graphs = Graph.query.all()
        
        graph_list = []
        for graph in graphs:
            graph_list.append({
                "id": graph.id,
                "name": graph.name,
                "dot_data_1": json.loads(graph.graph_data) if graph.graph_data else None,
                "pickle_data_1": json.loads(graph.attributes) if graph.attributes else None,
                "free_energy": json.loads(graph.free_energy) if graph.free_energy else None,
            })

        logger.info("Retrieved all graphs successfully.")
        return jsonify({"graphs": graph_list, "count": len(graph_list)}), 200

    except Exception as e:
        logger.exception("Error retrieving graphs from the database.")
        return jsonify({"error": f"Failed to retrieve graphs: {str(e)}"}), 500