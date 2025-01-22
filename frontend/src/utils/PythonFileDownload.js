import React from "react";
import "../style/PythonFileDownload.css"; 

const PythonFileDownload = () => {
  const handleDownload = () => {
    const pythonContent = `
# This requires installation of catmap from following repo
# https://github.com/SUNCAT-Center/catmap
import json
from catmap import ReactionModel
import numpy as np
import os

def can_reaction_happen(reaction, current_molecules):
    for j, part in enumerate(reaction):
        if len(set(part).difference(set(current_molecules))) == 0 and j == 0:
            return reaction, reaction[-1]
        elif len(set(part).difference(set(current_molecules))) == 0 and j != 0:
            return reaction[::-1], reaction[0]
    return False

def causality_aware_reaction_ordering(model, toremove=None, initial_molecules=["H2_g", "CO_g"]):
    initial_molecules += list(model.site_names)
    current_molecules = initial_molecules.copy()

    elementary_reactions = model.elementary_rxns.copy()

    for rxn in toremove:
        elementary_reactions.remove(rxn)

    ordered_reactions = []
    while len(elementary_reactions) != 0:
        for i, rxn in enumerate(elementary_reactions):
            if can_reaction_happen(rxn, current_molecules) == False:
                continue
            else:
                ordered_rxn, new_molecules = can_reaction_happen(rxn, current_molecules)
                elementary_reactions.remove(rxn)
                break
        current_molecules += new_molecules
        current_molecules = list(set(current_molecules))
        ordered_reactions.append(ordered_rxn)

    return ordered_reactions

def get_free_energy_map_data(models, toremove=None, initial_molecules=["H2_g", "CO_g"], model_labels=[]):
    # This function now returns the free energy map data
    free_energy_map = []

    for j, model in enumerate(models):
        ordered_reactions = causality_aware_reaction_ordering(model, toremove, initial_molecules=initial_molecules)

        dG = model.scaler.get_free_energies([573, 20.])
        print(f"Model: {dG}")

        states = [0]
        labels = ["H2_g + CO_g"]

        for rxn in ordered_reactions:
            rxnE, actE = model.get_rxn_energy(rxn, dG)

            if len(rxn) == 2:
                if "H2_g" in rxn[0][0]:
                    states.append(0.5 * rxnE)
                elif "CO_g" in rxn[0][0]:
                    states[-1] += rxnE
                    labels.append("H_h + CO_s")
            else:
                states.append(states[-1] + actE)
                labels.append(rxn[1][0])
                states.append(states[-2] + rxnE)
                labels.append(" + ".join([part for part in rxn[2] if "_" in part]))

        # Append the data for the current model
        free_energy_map.append({
            'states': states,
            'labels': labels,
            'model_label': model_labels[j] if len(model_labels) > 0 else f"Model {j+1}"
        })

    return free_energy_map

# Change to your working directory
os.chdir("/Users/your-file-path/Desktop/")
#Change to the required log file existing in your work directory
setup_file_path = "your-file.log"

# Load the reaction model
try:
    reaction_model = ReactionModel(setup_file=setup_file_path)
except Exception as e:
    print(f"Error loading the reaction model: {e}")

# Define reactions to remove
toremove = [
    [['H2O_g'], ['H2O_g']],
]

# Get the free energy map data
free_energy_data = get_free_energy_map_data([reaction_model], toremove=toremove, model_labels=["pathway 1"])

# Print or process the free energy data
print(free_energy_data)

# Prompt the user to input the desired output file name
output_file_name = input("Enter the desired name for the output file (include .json extension): ")

# Save the free energy data to the specified JSON file
with open(output_file_name, 'w') as json_file:
    json.dump(free_energy_data, json_file, indent=4)

print(f"Free energy data has been saved to {output_file_name}")

`;

    const blob = new Blob([pythonContent], { type: "text/x-python" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calculate_free_energy.py"; // Name of the file
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <button className="python-download-button" onClick={handleDownload}>
      <i className="fa-solid fa-download"></i> Free Energy Calculator
    </button>
  );
};

export default PythonFileDownload;
