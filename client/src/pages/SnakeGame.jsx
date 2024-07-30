import React, { useState, useEffect, useRef } from 'react';
import { Modal, Text } from '@mantine/core';

const SnakeGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;
        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          });
          setScore(score + 1);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [direction, food, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'green';
    snake.forEach((segment) => {
      context.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
    context.fillStyle = 'red';
    context.fillRect(food.x * 20, food.y * 20, 20, 20);
  }, [snake, food]);

  return (
    <Modal opened={true} onClose={onClose} title="Snake Game">
      <Text>Score: {score}</Text>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid black' }} />
    </Modal>
  );
};

export default SnakeGame;
