import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Text, TextInput, Select, LoadingOverlay, Modal, Group, Alert, Grid, Card, Image } from '@mantine/core';
import Navbar from '../components/Navbar';
import { useDisclosure } from '@mantine/hooks';

function ViewRewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [favoriteRewards, setFavoriteRewards] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // State for hiding filters
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Sorting variables
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('reward_points');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/rewards/getRewards');
        const data = await response.json();
        setRewards(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchUserPoints = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/points');
        const data = await response.json();
        setUserPoints(data.points);
      } catch (error) {
        setError(error);
      }
    };

    fetchRewards();
    document.title = 'Rewards - EcoUtopia';
    fetchUserPoints();
  }, []);

  useEffect(() => {
    const sortedRewards = [...rewards].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortColumn] - b[sortColumn];
      }
      return b[sortColumn] - a[sortColumn];
    });

    setFilteredRewards(
      sortedRewards.filter((reward) => {
        return (
          reward.reward_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showFavorites || favoriteRewards.includes(reward.reward_id))
        );
      })
    );
  }, [searchTerm, sortOrder, sortColumn, showFavorites, rewards, favoriteRewards]);

  useEffect(() => {
    if (alertMessage) {
      setNotificationVisible(true);
      const timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 5000);
      return () => clearTimeout(timer); // Clear timer on component unmount
    }
  }, [alertMessage]);

  const handleRedirectToGame = () => {
    navigate('/game'); // Redirect to the game page
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handleFavoriteToggle = (reward) => {
    setFavoriteRewards((prev) => {
      if (prev.includes(reward.reward_id)) {
        return prev.filter((id) => id !== reward.reward_id);
      }
      return [...prev, reward.reward_id];
    });
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/rewards/redeem/${rewardId}`, { method: 'POST' });
      if (response.ok) {
        setRewards((prevRewards) => prevRewards.filter((reward) => reward.reward_id !== rewardId));
        setAlertMessage('Reward redeemed successfully!');
      } else {
        throw new Error('Failed to redeem reward');
      }
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (rewards.length === 0) return <Text align="center">No rewards found</Text>;

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <Box padding="xl" style={{ marginTop: '70px' }} />
      <Suspense fallback={<LoadingOverlay visible />}>
        <Navbar />
      </Suspense>

      <Modal title="Redirecting" opened={showRedirectModal} onClose={() => setShowRedirectModal(false)} style={{ width: 300 }}>
        <Text>Redirecting you to the game page...</Text>
        <Group position="right" style={{ marginTop: '1rem' }}>
          <Button onClick={handleRedirectToGame} color="blue">
            Proceed
          </Button>
        </Group>
      </Modal>

      {notificationVisible && alertMessage && (
        <Alert title="Notification" color="red" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', width: '80%' }}>
          {alertMessage}
        </Alert>
      )}

      <Text align="center" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: '24px', marginBottom: '20px' }}>
        Points:
        <Box component="span" style={{ backgroundColor: '#d4edda', padding: '10px 20px', borderRadius: 4, fontSize: '24px', fontWeight: 700 }}>
          {userPoints}
        </Box>
      </Text>

      <Button onClick={handleRedirectToGame} style={{ marginBottom: 20, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Play Wordle Game to Earn Points
      </Button>

      <Text align="start" weight={700} style={{ fontSize: 30, marginBottom: 20, fontFamily: 'Roboto, sans-serif' }} c="deepBlue" fw={500} size="xl">
        Check out our cool rewards!
      </Text>

      {showFilters && ( // Toggle filters visibility
        <>
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
              { value: 'asc', label: 'Sort by Points (Ascending)' },
              { value: 'desc', label: 'Sort by Points (Descending)' },
            ]}
            placeholder="Sort by"
            style={{ marginBottom: 20 }}
          />
          <Select
            value={sortColumn}
            onChange={setSortColumn}
            data={[
              { value: 'reward_name', label: 'Sort by Name' },
              { value: 'reward_points', label: 'Sort by Points' },
              { value: 'reward_expiration', label: 'Sort by Expiration Date' },
            ]}
            placeholder="Sort by"
            style={{ marginBottom: 20 }}
          />
        </>
      )}

      <Button onClick={() => setShowFilters((prev) => !prev)} style={{ marginBottom: 20 }}>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <Grid>
        {filteredRewards.map((reward) => (
          <Grid.Col span={4} key={reward.reward_id}>
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#e6f9e6' }}> {/* Green box */}
              <Card.Section>
                <Image
                  src={reward.reward_image || 'https://placehold.co/300x200?text=Placeholder'}
                  alt={reward.reward_name}
                  height={200}
                />
              </Card.Section>
              <Text weight={500} size="lg" style={{ marginTop: 10, fontFamily: 'Roboto, sans-serif' }}>
                {reward.reward_name}
              </Text>
              <Text size="sm" style={{ marginTop: 5, fontFamily: 'Roboto, sans-serif' }}>
                {reward.reward_description}
              </Text>
              <Group position="apart" style={{ marginTop: 10 }}>
                <Box style={{ backgroundColor: '#d4edda', padding: '5px 10px', borderRadius: 4 }}>
                  Points: {reward.reward_points}
                </Box>
                <Button onClick={() => handleFavoriteToggle(reward)}>
                  {favoriteRewards.includes(reward.reward_id) ? 'Remove Favorite' : 'Add to Favorites'}
                </Button>
              </Group>
              <Button
                onClick={() => handleRedeemReward(reward.reward_id)}
                style={{ marginTop: 10 }}
                color="blue"
                radius="md"
                size="sm"
              >
                Redeem Reward
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default ViewRewards;
