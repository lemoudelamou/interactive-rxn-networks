import React, { useState } from 'react';
import '../style/TitleModal.css'; 

const TitleModal = ({ isOpen, onClose, onSave }) => {
  const [newTitle, setNewTitle] = useState('');

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSave = () => {
    onSave(newTitle); 
    onClose(); 
  };

  return (
    isOpen && (
      <div className="modal-overlay-title">
        <div className="modal-content-title">
          <h2>Choose A Name To Your Graph</h2>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Enter title here"
            className="title-input"
          />
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="button-style" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    )
  );
};

export default TitleModal;
