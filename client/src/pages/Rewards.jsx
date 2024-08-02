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
  Table,
  Checkbox,
  MultiSelect,
  Pagination,
  Paper,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "../components/Navbar";
import EcoWordleGame from './EcoWordleGame.jsx';

function ViewRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assume false initially
  const [alertMessage, setAlertMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending
  const [sortColumn, setSortColumn] = useState("reward_points"); // Column to sort by
  const [showWordleGame, setShowWordleGame] = useState(false); // New state for Wordle game modal
  const [userPoints, setUserPoints] = useState(0); // User's points
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [previewReward, setPreviewReward] = useState(null); // Reward to be previewed
  const [favoriteRewards, setFavoriteRewards] = useState([]); // User's favorite rewards
  const [showFavorites, setShowFavorites] = useState(false); // Show only favorite rewards
  const [categories, setCategories] = useState([]); // Reward categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories for filtering
  const [tags, setTags] = useState([]); // Reward tags
  const [selectedTags, setSelectedTags] = useState([]); // Selected tags for filtering
  const [showLoginAlert, setShowLoginAlert] = useState(false); // State for login alert

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

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rewards/getCategories");
        setCategories(response.data);
      } catch (error) {
        setError(error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/rewards/getTags");
        setTags(response.data);
      } catch (error) {
        setError(error);
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
    fetchCategories();
    fetchTags();
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
      setShowLoginAlert(true); // Show login alert
      return;
    }
    setShowWordleGame(true);
  };

  const handleWinWordle = () => {
    setUserPoints(userPoints + 5); // Add 5 points to user's points
    setShowWordleGame(false);
  };

  const handlePreviewReward = (reward) => {
    setPreviewReward(reward);
  };

  const handleFavoriteToggle = (reward) => {
    setFavoriteRewards((prev) => {
      if (prev.includes(reward.reward_id)) {
        return prev.filter((id) => id !== reward.reward_id);
      }
      return [...prev, reward.reward_id];
    });
  };

  const handleExportToCSV = () => {
    const headers = ["Name", "Description", "Points", "Expiration Date", "Category", "Tags"];
    const rows = rewards.map((reward) => [
      reward.reward_name,
      reward.reward_description,
      reward.reward_points,
      reward.reward_expiration ? new Date(reward.reward_expiration).toLocaleDateString() : "N/A",
      reward.category,
      reward.tags.join(", "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "rewards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedRewards = [...rewards].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortColumn] - b[sortColumn];
    }
    return b[sortColumn] - a[sortColumn];
  });

  const filteredRewards = sortedRewards.filter((reward) => {
    return (
      reward.reward_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(reward.category)) &&
      (selectedTags.length === 0 || selectedTags.some((tag) => reward.tags.includes(tag))) &&
      (!showFavorites || favoriteRewards.includes(reward.reward_id))
    );
  });

  const paginatedRewards = filteredRewards.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

      <Modal title="Preview Reward" opened={!!previewReward} onClose={() => setPreviewReward(null)} style={{ width: 400 }}>
        <Paper padding="md" style={{ position: "relative" }}>
          <Image
            src={previewReward?.reward_image || "https://placehold.co/600x400?text=Placeholder"}
            alt={previewReward?.reward_name}
            height={200}
          />
        </Paper>
        <Text align="center" fw={700} style={{ margin: 10 }}>
          {previewReward?.reward_name}
        </Text>
        <Text align="center" style={{ margin: 10 }}>
          {previewReward?.reward_description}
        </Text>
        <Text align="center" style={{ margin: 10 }}>
          Points: {previewReward?.reward_points}
        </Text>
        {previewReward?.reward_expiration && (
          <Text align="center" style={{ margin: 10 }}>
            Expiration Date: {new Date(previewReward.reward_expiration).toLocaleDateString()}
          </Text>
        )}
      </Modal>

      <Alert title="You need to log in" color="red" withCloseButton opened={showLoginAlert} onClose={() => setShowLoginAlert(false)}>
        Please log in to play the game.
      </Alert>

      <Text align="center">Points: {userPoints}</Text> {/* Display user points */}

      {/* Add a button to play the Wordle game */}
      <Button onClick={handlePlayWordle}>Play Wordle</Button>

      {/* Modal for the Wordle game */}
      <Modal opened={showWordleGame} onClose={() => setShowWordleGame(false)} title="EcoWordle Game" size="lg">
        <EcoWordleGame onWin={handleWinWordle} />
      </Modal>

      <Box padding="xl" style={{ marginTop: "30px" }} />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <TextInput
          placeholder="Search for rewards"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ width: "300px" }}
        />
        <Button color="blue" onClick={handleExportToCSV}>
          Export to CSV
        </Button>
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          placeholder="Sort by"
          data={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          style={{ width: "200px" }}
        />
      </Box>

      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => setSortColumn("reward_name")}>
              Name {sortColumn === "reward_name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => setSortColumn("reward_points")}>
              Points {sortColumn === "reward_points" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => setSortColumn("reward_expiration")}>
              Expiration Date {sortColumn === "reward_expiration" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th>Category</th>
            <th>Tags</th>
            <th>Actions</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRewards.map((reward) => (
            <tr key={reward.reward_id}>
              <td>{reward.reward_name}</td>
              <td>{reward.reward_points}</td>
              <td>
                {reward.reward_expiration
                  ? new Date(reward.reward_expiration).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{reward.category}</td>
              <td>{reward.tags.join(", ")}</td>
              <td>
                <Button onClick={() => handleRedeemClick(reward)} style={{ marginRight: "10px" }}>
                  Redeem
                </Button>
                <Button color="blue" onClick={() => handlePreviewReward(reward)}>
                  Preview
                </Button>
              </td>
              <td>
                <Checkbox
                  checked={favoriteRewards.includes(reward.reward_id)}
                  onChange={() => handleFavoriteToggle(reward)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination
        page={currentPage}
        onChange={setCurrentPage}
        total={Math.ceil(filteredRewards.length / pageSize)}
        style={{ marginTop: "20px" }}
      />
    </Container>
  );
}

export default ViewRewards;
