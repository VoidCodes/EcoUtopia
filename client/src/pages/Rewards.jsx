<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { Container, Card, Image, Text, Button, Group, SimpleGrid } from '@mantine/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Rewards() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // Fetch rewards from the backend API
    axios.get('/rewards')
      .then(response => setRewards(response.data))
      .catch(error => console.error('Error fetching rewards:', error));
  }, []);

  return (
    <Container size="xl">
      <h1>Rewards</h1>
      <SimpleGrid cols={3} spacing="lg">
        {rewards.map((reward) => (
          <Link to={`/reward/${reward.reward_id}`} key={reward.reward_id} style={{ textDecoration: 'none' }}>
            <Card shadow="sm" padding="lg" style={{ maxWidth: 200 }}>
              <Card.Section>
                <Image src={reward.reward_image} alt={reward.reward_name} height={160} />
              </Card.Section>
              <Group direction="column" spacing="sm" align="center">
                <Text weight={500} size="lg" style={{ marginTop: 10 }}>
                  {reward.reward_name}
                </Text>
                <Text size="sm">{reward.reward_points} Points</Text>
                <Button color="green">Redeem</Button>
              </Group>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default Rewards;

>>>>>>> 657722ec0363c13f3bea0379900a5e91d7298dac
