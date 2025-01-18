from . import db

class Graph(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    graph_data = db.Column(db.Text, nullable=True)
    attributes = db.Column(db.Text, nullable=True)
    free_energy = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "dot_data_1": self.dot_data_1,
            "pickle_data_1": self.pickle_data_1,
            "free_energy": self.free_energy,
        }
