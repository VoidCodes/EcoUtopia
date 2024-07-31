import React, { useState } from 'react';
import { Modal, Button, Grid, Text } from '@mantine/core';

const TicTacToe = ({ onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    const newBoard = [...board];
    if (calculateWinner(board) || newBoard[index]) return;
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : `Next player: ${isXNext ? 'X' : 'O'}`;

  const renderSquare = (index) => (
    <Button 
      style={{ width: 60, height: 60, fontSize: 24 }} 
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </Button>
  );

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  return (
    <Modal opened={true} onClose={onClose} title="Tic-Tac-Toe">
      <Text>{status}</Text>
      <Grid>
        {[0, 1, 2].map(row => (
          <Grid key={row} justify="center">
            {[0, 1, 2].map(col => (
              <Grid.Col key={row * 3 + col} span={4}>
                {renderSquare(row * 3 + col)}
              </Grid.Col>
            ))}
          </Grid>
        ))}
      </Grid>
      <Button onClick={() => setBoard(Array(9).fill(null))}>Restart</Button>
    </Modal>
  );
};

export default TicTacToe;
