import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Text, TextInput, Button, Grid, Box, Paper, Modal, Group } from '@mantine/core';

const WORDS = ["apple", "baker", "candy", "delta", "eagle", "flame", "grape", "house", "input", "jolly"];
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const LOCKOUT_KEY = 'wordleLockout';
const POINTS_KEY = 'userPoints';
const LOGIN_KEY = 'isLoggedIn';
const LEADERBOARD_KEY = 'leaderboard';

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

function EcoWordleGame() {
  const navigate = useNavigate();
  const [word, setWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [points, setPoints] = useState(Number(localStorage.getItem(POINTS_KEY) || 0));
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem(LOGIN_KEY)));
  const [timer, setTimer] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [leaderboard, setLeaderboard] = useState(JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login page if not logged in
    }

    const lockoutTime = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutTime && new Date() < new Date(lockoutTime)) {
      alert("The game is locked for 24 hours.");
      navigate('/rewards');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (currentAttempt === MAX_ATTEMPTS && !win) {
      setGameOver(true);
    }
  }, [currentAttempt, win]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  const handleInputChange = (e) => {
    if (e.target.value.length <= WORD_LENGTH) {
      setCurrentGuess(e.target.value.toLowerCase());
    }
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length === WORD_LENGTH) {
      const updatedGuesses = [...guesses];
      updatedGuesses[currentAttempt] = currentGuess;
      setGuesses(updatedGuesses);

      if (currentGuess === word) {
        setWin(true);
        setGameOver(true);
        const newPoints = points + 5;
        setPoints(newPoints);
        localStorage.setItem(POINTS_KEY, newPoints);
        updateLeaderboard(newPoints);
      } else {
        setCurrentAttempt(currentAttempt + 1);
        setCurrentGuess("");
      }
    }
  };

  const getLetterColor = (letter, index) => {
    if (word[index] === letter) {
      return 'green';
    } else if (word.includes(letter)) {
      return 'yellow';
    } else {
      return 'gray';
    }
  };

  const handleRestart = () => {
    setWord(getRandomWord());
    setGuesses(Array(MAX_ATTEMPTS).fill(""));
    setCurrentGuess("");
    setCurrentAttempt(0);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setHintUsed(false);
  };

  const handleLeaveGame = () => {
    setShowLeaveModal(true);
  };

  const confirmLeaveGame = () => {
    localStorage.setItem(LOCKOUT_KEY, new Date(new Date().getTime() + 24 * 60 * 60 * 1000)); // 24-hour lockout
    navigate('/rewards');
  };

  const handleHint = () => {
    if (!hintUsed && points > 0) {
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (!currentGuess.includes(word[i])) {
          setCurrentGuess((prev) => prev + word[i]);
          break;
        }
      }
      setHintUsed(true);
      setPoints((prev) => prev - 1);
      localStorage.setItem(POINTS_KEY, points - 1);
    }
  };

  const updateLeaderboard = (newPoints) => {
    const newEntry = { points: newPoints, time: timer, date: new Date().toLocaleString() };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.points - a.points).slice(0, 5);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  };

  return (
    <Container>
      <Text align="center" size="xl" weight={700} style={{ margin: '20px 0' }}>
        EcoWordle Game
      </Text>
      <Text align="center" size="sm">Timer: {timer}s</Text>
      <Grid justify="center">
        {guesses.map((guess, guessIndex) => (
          <Grid key={guessIndex} style={{ marginBottom: '10px' }}>
            {Array.from({ length: WORD_LENGTH }).map((_, letterIndex) => (
              <Box key={letterIndex} style={{ width: '40px', height: '40px', backgroundColor: guess[letterIndex] ? getLetterColor(guess[letterIndex], letterIndex) : 'white', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {guess[letterIndex]}
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
      {!gameOver && (
        <>
          <TextInput
            value={currentGuess}
            onChange={handleInputChange}
            placeholder="Enter your guess"
            disabled={gameOver}
          />
          <Button onClick={handleSubmitGuess} disabled={currentGuess.length !== WORD_LENGTH} style={{ marginTop: '10px' }}>
            Submit Guess
          </Button>
          <Button onClick={handleHint} color="yellow" disabled={hintUsed || points <= 0} style={{ marginTop: '10px' }}>
            Use Hint (-1 Point)
          </Button>
          <Button onClick={handleLeaveGame} color="red" style={{ marginTop: '10px' }}>
            Leave Game
          </Button>
        </>
      )}
      {gameOver && (
        <Paper padding="md" style={{ textAlign: 'center', marginTop: '20px' }}>
          {win ? <Text size="lg" weight={700} color="green">Congratulations! You guessed the word and earned 5 points!</Text> : <Text size="lg" weight={700} color="red">Game Over! The word was: {word}</Text>}
          <Button onClick={handleRestart} style={{ marginTop: '10px' }}>
            Play Again
          </Button>
        </Paper>
      )}
      <Text align="center" size="xl" weight={700} style={{ margin: '20px 0' }}>
        Leaderboard
      </Text>
      <Grid justify="center">
        {leaderboard.map((entry, index) => (
          <Paper key={index} padding="md" style={{ width: '100%', margin: '10px 0' }}>
            <Text align="center">#{index + 1} - Points: {entry.points}, Time: {entry.time}s, Date: {entry.date}</Text>
          </Paper>
        ))}
      </Grid>
      {/* Leave Game Confirmation Modal */}
      <Modal
        opened={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Confirm Leave"
      >
        <Text size="sm">Are you sure you want to leave the game? It will be locked for 24 hours.</Text>
        <Group position="right" style={{ marginTop: '1rem' }}>
          <Button onClick={() => setShowLeaveModal(false)} color="gray">
            Cancel
          </Button>
          <Button onClick={confirmLeaveGame} color="red">
            Confirm
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default EcoWordleGame;