import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import {
  Container,
  Box,
  Button,
  Text,
  TextInput,
  Select,
  LoadingOverlay,
  Modal,
  Group,
  Alert,
  Grid,
  Card,
  Paper,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "../../components/Navbar";
import WordleGame from "../../components/WordleGame"; // Assuming WordleGame component exists

function ViewRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assume false initially
  const [alertMessage, setAlertMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending
  const [showWordleGame, setShowWordleGame] = useState(false); // New state for Wordle game modal
  const [userPoints, setUserPoints] = useState(0); // User's points

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rewards/getRewards");
        setRewards(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchUserPoints = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get("http://localhost:3000/api/user/points");
          setUserPoints(response.data.points);
        } catch (error) {
          setError(error);
        }
      }
    };

    fetchRewards();
    document.title = "Rewards - EcoUtopia";
    fetchUserPoints();
  }, [isLoggedIn]);

  const handleRedeemClick = () => {
    if (!isLoggedIn) {
      setAlertMessage("You can only redeem if you are logged in!");
      return;
    }
    open();
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePlayWordle = () => {
    if (!isLoggedIn) {
      setAlertMessage("You need to log in to play the game!");
      return;
    }
    setShowWordleGame(true);
  };

  const handleWinWordle = () => {
    setUserPoints(userPoints + 5); // Add 5 points to user's points
    setShowWordleGame(false);
  };

  const sortedRewards = [...rewards].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.reward_points - b.reward_points;
    }
    return b.reward_points - a.reward_points;
  });

  const filteredRewards = sortedRewards.filter((reward) =>
    reward.reward_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (rewards.length === 0) return <Text align="center">No rewards found</Text>;

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <Box padding="xl" style={{ marginTop: "70px" }} />
      <Suspense fallback={<LoadingOverlay visible />}>
        <Navbar />
      </Suspense>
      <Modal title="Redeem Reward" opened={opened} onClose={close} style={{ width: 400 }}>
        <Text>Are you sure you want to redeem this reward?</Text>
        <Box style={{ height: 20 }} />
        <Group style={{ justifyContent: "flex-start" }}>
          <Button onClick={close} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button color="red" onClick={close}>
            Redeem
          </Button>
        </Group>
      </Modal>

      <Text align="center">Points: {userPoints}</Text> {/* Display user points */}
      <Button onClick={handlePlayWordle} style={{ marginBottom: 20 }}>
        Play Wordle Game to Earn Points
      </Button>

      <Suspense fallback={<LoadingOverlay visible />}>
        {showWordleGame && <WordleGame onClose={() => setShowWordleGame(false)} onWin={handleWinWordle} />}
      </Suspense>

      <Text align="start" weight={700} style={{ fontSize: 30, marginBottom: 20 }} c="deepBlue" fw={500} size="xl">
        Check out our cool rewards!
      </Text>
      <TextInput
        placeholder="Search rewards"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        style={{ marginBottom: 20 }}
      />
      <Select
        value={sortOrder}
        onChange={handleSortChange}
        data={[
          { value: "asc", label: "Sort by Points (Ascending)" },
          { value: "desc", label: "Sort by Points (Descending)" },
        ]}
        placeholder="Sort by"
        style={{ marginBottom: 20 }}
      />
      {alertMessage && (
        <Alert title="Notice" color="red" onClose={() => setAlertMessage("")}>
          {alertMessage}
        </Alert>
      )}
      <Grid>
        {filteredRewards.map((reward) => (
          <Card key={reward.reward_id} shadow="xs" style={{ width: 300, margin: 10 }}>
            <Paper padding="md" style={{ position: "relative" }}>
              <Image
                src={null}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                alt="Reward Image"
                h={200}
              />
            </Paper>
            <Text align="center" fw={700} style={{ margin: 10 }}>
              {reward.reward_name}
            </Text>
            <Text align="center" style={{ margin: 10 }}>
              {reward.reward_description}
            </Text>
            <Group grow justify="center">
              <Text weight={700}>Points: {reward.reward_points}</Text>
              <Button color="deepBlue" variant="filled" size="sm" onClick={handleRedeemClick} style={{ margin: 10 }}>
                Redeem
              </Button>
            </Group>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default ViewRewards;
