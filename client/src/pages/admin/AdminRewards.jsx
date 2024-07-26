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
  Image,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash, IconDots } from "@tabler/icons-react";

function AdminRewards() {
  const [opened, { open, close }] = useDisclosure(false);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardToDelete, setRewardToDelete] = useState(null);
  const [rewardToView, setRewardToView] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    sortByPoints: "",
    status: "",
  });

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/rewards/getRewards"
        );
        setRewards(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchRewards();
    document.title = "Rewards - EcoUtopia";
  }, []);

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

  const handleSearch = () => {
    // This function filters rewards based on the search term
    setRewards(rewards.filter(reward =>
      reward.reward_name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  const handleFilter = () => {
    let filteredRewards = [...rewards];

    if (filter.sortByPoints) {
      filteredRewards = filteredRewards.sort((a, b) => {
        if (filter.sortByPoints === "lowToHigh") {
          return a.reward_points - b.reward_points;
        } else {
          return b.reward_points - a.reward_points;
        }
      });
    }

    if (filter.status) {
      filteredRewards = filteredRewards.filter(
        (reward) => reward.status === filter.status
      );
    }

    setRewards(filteredRewards);
  };

  const handleResetFilters = () => {
    setFilter({ sortByPoints: "", status: "" });
    setSearchTerm("");
    // Fetch rewards again to reset the filtered rewards
    fetchRewards();
  };

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (rewards.length === 0) return <Text align="center">No rewards found</Text>;

  const rows = rewards.map((reward) => (
    <Table.Tr key={reward.reward_id}>
      <Table.Td>
        <Group gap="sm">
          <div>
            <Text fz="sm" fw={500}>
              {reward.reward_name}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{reward.reward_description}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{dayjs(reward.createdAt).format("DD/MM/YYYY")}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{dayjs(reward.updatedAt).format("DD/MM/YYYY")}</Text>
      </Table.Td>
      <Table.Td>
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
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Box padding="xl" style={{ marginTop: "30px" }} />
      <Title order={1}>Manage Rewards</Title>
      <Box padding="xl" style={{ marginTop: "70px" }} />
      <Flex justify="space-between">
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
              data={[
                { value: "lowToHigh", label: "Low to High" },
                { value: "highToLow", label: "High to Low" },
              ]}
              value={filter.sortByPoints}
              onChange={(value) => setFilter({ ...filter, sortByPoints: value })}
            />
            <Select
              placeholder="Filter by status"
              data={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            />
            <Button color="gray" onClick={handleFilter}>
              Filter
            </Button>
            <Button color="red" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Text c="dimmed">{rewards.length} rewards found</Text>
          </Flex>
        </Box>
        <Anchor href="/admin/create-reward">
          <Button justify="flex-end" color="blue">
            Create Reward
          </Button>
        </Anchor>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        title={rewardToDelete ? "Delete Reward" : "View Reward"}
      >
        {rewardToDelete ? (
          <>
            <Title c="red" order={3}>
              Are you sure you want to delete this reward?
            </Title>
            <Box padding="xl" style={{ marginTop: "20px" }} />
            <Text>This action cannot be undone.</Text>
            <Box padding="xl" style={{ marginTop: "20px" }} />
            <Group align="right">
              <Button color="red" onClick={deleteReward}>
                Delete
              </Button>
              <Button variant="transparent" onClick={close} color="gray">
                Cancel
              </Button>
            </Group>
          </>
        ) : (
          rewardToView && (
            <>
              <Text fz="sm" fw={500}>
                Reward Name: {rewardToView.reward_name}
              </Text>
              <Text fz="sm" fw={500}>
                Description: {rewardToView.reward_description}
              </Text>
              <Text fz="sm" fw={500}>
                Points: {rewardToView.reward_points}
              </Text>
              <Text fz="sm" fw={500}>
                Created At: {dayjs(rewardToView.createdAt).format("DD/MM/YYYY")}
              </Text>
              <Text fz="sm" fw={500}>
                Updated At: {dayjs(rewardToView.updatedAt).format("DD/MM/YYYY")}
              </Text>
              {rewardToView.reward_image && (
                <Box mt="md">
                  <Text>Image:</Text>
                  <Image
                    src={`/uploads/${rewardToView.reward_image}`}
                    alt="Reward Image"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>
              )}
              <Group align="right" mt="md">
                <Button variant="outline" onClick={close} color="gray">
                  Close
                </Button>
              </Group>
            </>
          )
        )}
      </Modal>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Reward Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Actions</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Container>
  );
}

export default AdminRewards;
