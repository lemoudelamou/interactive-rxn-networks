from flask import Blueprint, jsonify
from app.models import Graph
from app import db
import logging

logger = logging.getLogger(__name__)
bp = Blueprint('delete', __name__)

@bp.route('/delete/<int:id>', methods=['DELETE'])
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

