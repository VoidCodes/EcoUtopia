import React, { useState } from 'react';
import { Container, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TicTacToe from '../components/TicTacToe.jsx';
import MemoryCardGame from '../components/MemoryGame.jsx';
import SnakeGame from '../components/SnakeGame.jsx';
import './ErrorPage.css'; // Import the CSS for glowing effect

const ErrorPage = () => {
  const [game, setGame] = useState(null);
  const [glow, setGlow] = useState(false);
  const [gameOpened, { open: openGame, close: closeGame }] = useDisclosure(false);

  const handleErrorMessageClick = () => {
    setGlow(true);
    const games = [<TicTacToe onClose={closeGame} />, <MemoryCardGame onClose={closeGame} />, <SnakeGame onClose={closeGame} />];
    setGame(games[Math.floor(Math.random() * games.length)]);
    openGame();
  };

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <Text
        align="center"
        weight={700}
        style={{ fontSize: 30, marginBottom: 20, cursor: 'pointer' }}
        className={glow ? 'glow' : ''}
        onClick={handleErrorMessageClick}
      >
        Sorry for the inconvenience. Click here to play a game!
      </Text>
      {gameOpened && game}
    </Container>
  );
};

export default ErrorPage;
