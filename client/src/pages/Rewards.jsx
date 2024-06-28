import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useDisclosure } from '@mantine/hooks';
import { 
  Container,
  Grid,
  Paper,
  Card,
  Image,
  Text,
  Button,
  Group,
  Box,
  LoadingOverlay,
  Modal,
 } from "@mantine/core";
import { useState, useEffect } from "react";

function ViewRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  
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

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (rewards.length === 0) return <Text align="center">No courses found</Text>;

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <Box padding="xl" style={{marginTop: '70px'}} />
      <Navbar />
      <Modal
        title="Redeem Reward"
        opened={opened}
        onClose={close}
        style={{ width: 400 }}
      >
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
      <Text
        align="start"
        weight={700}
        style={{ fontSize: 30, marginBottom: 20 }}
        c="deepBlue"
        fw={500}
        size="xl"
      >
        Check out our cool rewards!
      </Text>
      <Grid>
        {rewards.map((reward) => (
          <Card
            key={reward.reward_id}
            shadow="xs"
            style={{ width: 300, margin: 10 }}
          >
            <Paper padding="md" style={{ position: "relative" }}>
              <Image
                src={null}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                alt="aa"
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
              <Button
                color="deepBlue"
                variant="filled"
                size="sm"
                onClick={open}
                style={{ margin: 10 }}
              >
                Redeem
              </Button>
            </Group>
          </Card>
        ))}
      </Grid>
    </Container>
  )
}

export default ViewRewards;