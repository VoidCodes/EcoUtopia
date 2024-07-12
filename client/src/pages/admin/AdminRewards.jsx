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
  rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPencil,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';

function AdminRewards() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardToDelete, setRewardToDelete] = useState(null);
  const [rewardToEdit, setRewardToEdit] = useState(null);

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
      await axios.delete(`http://localhost:3000/api/rewards/deleteReward/${rewardToDelete}`);
      console.log(`Reward with ID ${rewardToDelete} deleted`);
      setRewards(rewards.filter((reward) => reward.reward_id !== rewardToDelete));
    } catch (error) {
      console.error(error);
    } finally {
      close();
      setRewardToDelete(null);
    }
  };

  const updateReward = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/rewards/updateReward/${rewardToEdit.reward_id}`, rewardToEdit);
      setRewards(rewards.map((reward) => (reward.reward_id === rewardToEdit.reward_id ? response.data : reward)));
    } catch (error) {
      console.error(error);
    } finally {
      closeEdit();
      setRewardToEdit(null);
    }
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
        <Text fz="sm">{reward.points}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{dayjs(reward.createdAt).format('DD/MM/YYYY')}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{dayjs(reward.updatedAt).format('DD/MM/YYYY')}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-start">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              setRewardToEdit(reward);
              openEdit();
            }}
          >
            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <Menu
            transitionProps={{ transition: 'pop' }}
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
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl">
      <Box padding="xl" style={{ marginTop: '30px' }} />
      <Title order={1}>Manage Rewards</Title>
      <Box padding="xl" style={{ marginTop: '70px' }} />
      <Flex justify='space-between'>
        <Box>
          <Flex gap="md">
            <TextInput placeholder="Search rewards" />
            <Text c="dimmed">{rewards.length} rewards found</Text>
          </Flex>
        </Box>
        <Anchor href="/admin/create-reward">
          <Button justify='flex-end' color="blue">Create Reward</Button>
        </Anchor>
      </Flex>

      <Modal opened={opened} onClose={close} title="Delete Reward">
        <Title c='red' order={3}>Are you sure you want to delete this reward?</Title>
        <Box padding="xl" style={{ marginTop: '20px' }} />
        <Text>This action cannot be undone.</Text>
        <Box padding="xl" style={{ marginTop: '20px' }} />
        <Group align='right'>
          <Button color='red' onClick={deleteReward}>Delete</Button>
          <Button variant="transparent" onClick={close} color='gray'>Cancel</Button>
        </Group>
      </Modal>

      <Modal opened={editOpened} onClose={closeEdit} title="Edit Reward">
        <TextInput
          label="Reward Name"
          value={rewardToEdit?.reward_name}
          onChange={(e) => setRewardToEdit({ ...rewardToEdit, reward_name: e.target.value })}
        />
        <TextInput
          label="Description"
          value={rewardToEdit?.reward_description}
          onChange={(e) => setRewardToEdit({ ...rewardToEdit, reward_description: e.target.value })}
        />
        <TextInput
          label="Points"
          value={rewardToEdit?.points}
          onChange={(e) => setRewardToEdit({ ...rewardToEdit, points: e.target.value })}
        />
        <Group align='right' style={{ marginTop: '20px' }}>
          <Button onClick={updateReward}>Save</Button>
          <Button variant="transparent" onClick={closeEdit} color='gray'>Cancel</Button>
        </Group>
      </Modal>

      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Reward Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Points</Table.Th>
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
