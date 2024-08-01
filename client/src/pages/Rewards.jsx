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
  Pagination,
  Table,
  Checkbox,
  MultiSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "../components/Navbar";
import WordleGame from "../components/EcoWordleGame";

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
      setAlertMessage("You need to log in to play the game!");
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
      <Select
        value={sortColumn}
        onChange={setSortColumn}
        data={[
          { value: "reward_name", label: "Sort by Name" },
          { value: "reward_points", label: "Sort by Points" },
          { value: "reward_expiration", label: "Sort by Expiration Date" },
        ]}
        placeholder="Sort by Column"
        style={{ marginBottom: 20 }}
      />
      <MultiSelect
        data={categories.map((category) => ({ value: category, label: category }))}
        value={selectedCategories}
        onChange={setSelectedCategories}
        placeholder="Filter by categories"
        style={{ marginBottom: 20 }}
      />
      <MultiSelect
        data={tags.map((tag) => ({ value: tag, label: tag }))}
        value={selectedTags}
        onChange={setSelectedTags}
        placeholder="Filter by tags"
        style={{ marginBottom: 20 }}
      />
      <Checkbox
        label="Show only favorite rewards"
        checked={showFavorites}
        onChange={(event) => setShowFavorites(event.currentTarget.checked)}
        style={{ marginBottom: 20 }}
      />
      <Button onClick={handleExportToCSV} style={{ marginBottom: 20 }}>
        Export to CSV
      </Button>
      {alertMessage && (
        <Alert title="Notice" color="red" onClose={() => setAlertMessage("")}>
          {alertMessage}
        </Alert>
      )}
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Points</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRewards.map((reward) => (
            <tr key={reward.reward_id}>
              <td>{reward.reward_name}</td>
              <td>{reward.reward_description}</td>
              <td>{reward.reward_points}</td>
              <td>{reward.reward_expiration ? new Date(reward.reward_expiration).toLocaleDateString() : "N/A"}</td>
              <td>
                <Button variant="outline" color="blue" size="xs" onClick={() => handlePreviewReward(reward)}>
                  Preview
                </Button>
                <Button
                  variant="outline"
                  color="yellow"
                  size="xs"
                  onClick={() => handleFavoriteToggle(reward)}
                  style={{ marginLeft: 5 }}
                >
                  {favoriteRewards.includes(reward.reward_id) ? "Unfavorite" : "Favorite"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Select
        value={pageSize.toString()}
        onChange={(value) => setPageSize(Number(value))}
        data={[
          { value: "5", label: "5 items per page" },
          { value: "10", label: "10 items per page" },
          { value: "20", label: "20 items per page" },
        ]}
        placeholder="Items per page"
        style={{ marginTop: 20 }}
      />
      <Pagination
        total={Math.ceil(filteredRewards.length / pageSize)}
        page={currentPage}
        onChange={setCurrentPage}
        size="sm"
        radius="md"
        withControls
        withEdges
        style={{ marginTop: 20 }}
      />
    </Container>
  );
}

export default ViewRewards;
