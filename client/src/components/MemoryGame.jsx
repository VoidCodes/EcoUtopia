import React, { useState, useEffect } from 'react';
import { Modal, Button, Grid, Text } from '@mantine/core';

const MemoryCardGame = ({ onClose }) => {
  const generateCards = () => {
    const cards = [
      'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F',
      'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L',
    ];
    return cards.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards([...matchedCards, cards[firstIndex]]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  }, [flippedCards]);

  const handleCardClick = (index) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const renderCard = (card, index) => (
    <Button
      key={index}
      style={{ width: 60, height: 60, fontSize: 24 }}
      onClick={() => handleCardClick(index)}
    >
      {flippedCards.includes(index) || matchedCards.includes(card) ? card : '?'}
    </Button>
  );

  return (
    <Modal opened={true} onClose={onClose} title="Memory Card Game">
      <Grid>
        {cards.map((card, index) => (
          <Grid.Col key={index} span={2}>
            {renderCard(card, index)}
          </Grid.Col>
        ))}
      </Grid>
      <Button onClick={() => setCards(generateCards())}>Restart</Button>
    </Modal>
  );
};

export default MemoryCardGame;
