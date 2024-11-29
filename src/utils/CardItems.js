import React from 'react';
import { Card, Button } from 'react-bootstrap';  
import '../style/CardItem.css'; 

const CardItem = ({ card, onClick, onDeleteClick }) => (
  <Card className="custom-card" onClick={onClick}>  
    <Card.Img variant="top" src={card.imageSrc} alt={card.title} />  
    <Card.Body>
      <Card.Title>{card.title}</Card.Title>  
      <Card.Text>{card.content}</Card.Text>  
    </Card.Body>
    <Card.Footer className="text-center">
    <button className="card-button" onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the card's onClick
          onDeleteClick();
        }}><i class="fa-solid fa-trash"></i>
</button>

    </Card.Footer>
  </Card>
);

export default CardItem;
