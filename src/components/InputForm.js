import React, { useState } from 'react';
import '../style/InputForm.css'


const InputForm = ({ onAddReaction }) => {
  const [reaction, setReaction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reaction.trim()) { 
      onAddReaction(reaction);
      setReaction('');
    } else {
      console.warn("Reaction cannot be empty");
    }
  };

  return (
    <div className='container_add'>
    <form onSubmit={handleSubmit}>
      <textarea
        rows={4} 
        className='text_area'
        value={reaction}
        onChange={(e) => setReaction(e.target.value)}
        color='white'
        placeholder="Enter chemical reaction (e.g., Reactant + Reactant = Product)"
        required
      />
      <button type="submit" className='button_add'>Add Reaction</button>
    </form>
    </div>
  );
};

export default InputForm;
