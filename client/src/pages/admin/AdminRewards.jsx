import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  Container,
  Flex,
  Button,
  TextInput,
  Box,
  Anchor,
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  Title,
  Modal,
  LoadingOverlay,
  rem,
  Select,
  MultiSelect,
  Alert,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash, IconDots } from "@tabler/icons-react";

function AdminRewards() {
  const [opened, { open, close }] = useDisclosure(false);
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardToDelete, setRewardToDelete] = useState(null);
  const [rewardToView, setRewardToView] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    sortByPoints: "",
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteRewards, setFavoriteRewards] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/rewards/getRewards"
        );
        setRewards(response.data);
        setFilteredRewards(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchRewards();
    document.title = "Rewards - EcoUtopia";
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rewards, searchTerm, filter, selectedCategories, selectedTags, showFavorites]);

  const applyFilters = () => {
    let filteredRewards = [...rewards];

    // Search filter
    if (searchTerm) {
      filteredRewards = filteredRewards.filter((reward) =>
        reward.reward_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (filter.sortByPoints) {
      filteredRewards = filteredRewards.sort((a, b) => {
        if (filter.sortByPoints === "lowToHigh") {
          return a.reward_points - b.reward_points;
        } else {
          return b.reward_points - a.reward_points;
        }
      });
    }

    // Status filter
    if (filter.status) {
      filteredRewards = filteredRewards.filter(
        (reward) => reward.status === filter.status
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filteredRewards = filteredRewards.filter((reward) =>
        selectedCategories.includes(reward.category)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filteredRewards = filteredRewards.filter((reward) =>
        selectedTags.some((tag) => reward.tags.includes(tag))
      );
    }

    // Favorites filter
    if (showFavorites) {
      filteredRewards = filteredRewards.filter((reward) =>
        favoriteRewards.includes(reward.reward_id)
      );
    }

    setFilteredRewards(filteredRewards);
  };

  const handleSearch = () => {
    applyFilters();
  };

  const handleFilter = () => {
    applyFilters();
  };

  const handleResetFilters = () => {
    setFilter({ sortByPoints: "", status: "" });
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setShowFavorites(false);
    applyFilters(); // Reset and reapply filters
  };

  const deleteReward = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/rewards/deleteReward/${rewardToDelete}`
      );
      console.log(`Reward with ID ${rewardToDelete} deleted`);
      setRewards(rewards.filter((reward) => reward.reward_id !== rewardToDelete));
    } catch (error) {
      console.error(error);
    } finally {
      close();
      setRewardToDelete(null);
    }
  };

  const handleFavoriteToggle = (reward) => {
    setFavoriteRewards((prevFavorites) =>
      prevFavorites.includes(reward.reward_id)
        ? prevFavorites.filter((id) => id !== reward.reward_id)
        : [...prevFavorites, reward.reward_id]
    );
  };

  const handleExportToCSV = () => {
    const csvContent = [
      ["Reward Name", "Description", "Points", "Expiration Date"].join(","),
      ...filteredRewards.map((reward) =>
        [
          reward.reward_name,
          reward.reward_description,
          reward.reward_points,
          reward.reward_expiration
            ? new Date(reward.reward_expiration).toLocaleDateString()
            : "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "rewards.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const paginatedRewards = filteredRewards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (filteredRewards.length === 0) return <Text align="center">No rewards found</Text>;

  const rows = paginatedRewards.map((reward) => (
    <tr key={reward.reward_id}>
      <td>
        <Group gap="sm">
          <div>
            <Text fz="sm" fw={500}>
              {reward.reward_name}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Text fz="sm">{reward.reward_description}</Text>
      </td>
      <td>
        <Text fz="sm">{dayjs(reward.createdAt).format("DD/MM/YYYY")}</Text>
      </td>
      <td>
        <Text fz="sm">{dayjs(reward.updatedAt).format("DD/MM/YYYY")}</Text>
      </td>
      <td>
        <Group gap={0} justify="flex-start">
          <Anchor href={`/admin/edit-reward/${reward.reward_id}`}>
            <ActionIcon variant="subtle" color="gray">
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          </Anchor>
          <Menu
            transitionProps={{ transition: "pop" }}
            withArrow
            position="bottom-end"
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                color="red"
                onClick={() => {
                  setRewardToDelete(reward.reward_id);
                  open();
                }}
              >
                Delete reward
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                onClick={() => {
                  setRewardToView(reward);
                  open();
                }}
              >
                View reward
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Container size="xl">
      <Box padding="xl" style={{ marginTop: "30px" }} />
      <Title order={1}>Manage Rewards</Title>
      <Box padding="xl" style={{ marginTop: "70px" }} />
      <Flex justify="space-between" align="center">
        <Box>
          <Flex gap="md">
            <TextInput
              placeholder="Search rewards"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
            />
            <Button color="blue" onClick={handleSearch}>
              Search
            </Button>
            <Select
              placeholder="Sort by points"
              value={filter.sortByPoints}
              onChange={(value) => setFilter({ ...filter, sortByPoints: value })}
            >
              <option value="">None</option>
              <option value="lowToHigh">Points: Low to High</option>
              <option value="highToLow">Points: High to Low</option>
            </Select>
            <Select
              placeholder="Status"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
            <MultiSelect
              placeholder="Filter by categories"
              data={categories}
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
            <MultiSelect
              placeholder="Filter by tags"
              data={tags}
              value={selectedTags}
              onChange={setSelectedTags}
            />
            <Button color="teal" onClick={() => setShowFavorites(!showFavorites)}>
              {showFavorites ? "Show All" : "Show Favorites"}
            </Button>
            <Button color="red" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button color="green" onClick={handleExportToCSV}>
              Export to CSV
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Box padding="xl" style={{ marginTop: "30px" }} />
      <Table>
        <thead>
          <tr>
            <th>Reward Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Box padding="xl" style={{ marginTop: "30px" }} />
      <Pagination
        total={Math.ceil(filteredRewards.length / pageSize)}
        page={currentPage}
        onChange={handlePageChange}
        onPerPageChange={handlePageSizeChange}
        styles={{ controls: { marginTop: rem(10) } }}
      />
      <Modal opened={rewardToDelete !== null} onClose={close} title="Confirm Deletion">
        <Text>Are you sure you want to delete this reward?</Text>
        <Group position="right" mt="md">
          <Button color="red" onClick={deleteReward}>Delete</Button>
          <Button onClick={close}>Cancel</Button>
        </Group>
      </Modal>
      <Modal opened={rewardToView !== null} onClose={close} title="View Reward">
        {rewardToView && (
          <div>
            <Text><strong>Name:</strong> {rewardToView.reward_name}</Text>
            <Text><strong>Description:</strong> {rewardToView.reward_description}</Text>
            <Text><strong>Points:</strong> {rewardToView.reward_points}</Text>
            <Text><strong>Expiration Date:</strong> {rewardToView.reward_expiration ? dayjs(rewardToView.reward_expiration).format("DD/MM/YYYY") : "N/A"}</Text>
            <Text><strong>Status:</strong> {rewardToView.status}</Text>
          </div>
        )}
      </Modal>
    </Container>
  );
}

export default AdminRewards;
