import React, { useState, useEffect } from 'react';
import { Container, Card, Image, Text, Button, Group, SimpleGrid } from '@mantine/core';
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
          <Card key={reward.reward_id} shadow="sm" padding="lg" style={{ maxWidth: 200 }}>
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
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default Rewards;
