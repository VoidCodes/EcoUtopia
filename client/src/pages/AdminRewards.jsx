import { Container, Button, HoverCard, TextInput, NumberInput, DateInput, Group, Notification } from "@mantine/core";
import { useState, useEffect } from "react";
import axios from 'axios';

function AdminRewards() {
    useEffect(() => {
        document.title = "Admin Rewards - EcoUtopia";
    }, []);

    const [rewardName, setRewardName] = useState('');
    const [rewardDescription, setRewardDescription] = useState('');
    const [rewardPoints, setRewardPoints] = useState(0);
    const [rewardExpiryDate, setRewardExpiryDate] = useState(new Date());
    const [notification, setNotification] = useState({message: '', color: ''});

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/rewards/createReward', {
                reward_name: rewardName,
                reward_description: rewardDescription,
                reward_points: rewardPoints,
                reward_expiry_date: rewardExpiryDate.toISOString()
            });

            setNotification({message: 'Reward added successfully!', color: 'green'});
            setRewardName('');
            setRewardDescription('');
            setRewardPoints(0);
            setRewardExpiryDate(new Date());
        } catch (error) {
            setNotification({message: error.response.data.message, color: 'red'});
        }
    };

    return (
        <Container size={"xl"}>
            <h1>Admin Rewards</h1>
            <form onSubmit={handleSubmit}>
                <Group direction="column" spacing="md">
                    <TextInput
                        placeholder="Reward Name"
                        value={rewardName}
                        onChange={(e) => setRewardName(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        placeholder="Reward Description"
                        value={rewardDescription}
                        onChange={(e) => setRewardDescription(e.currentTarget.value)}
                    />
                    <NumberInput
                        placeholder="Reward Points"
                        value={rewardPoints}
                        onChange={(value) => setRewardPoints(value)}
                        required
                    />
                    <DateInput
                        placeholder="Reward Expiry Date"
                        value={rewardExpiryDate}
                        onChange={(date) => setRewardExpiryDate(date)}
                        required
                    />
                    <Button type="submit">Add Reward</Button>
                </Group>
            </form>
            {notification.message && (
                <Notification color={notification.color}>
                    {notification.message}
                </Notification>
            )}
            <HoverCard shadow="md">
                <HoverCard.Target>
                    <Button>Hover me</Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <p>This is a hover card example.</p>
                </HoverCard.Dropdown>
            </HoverCard>
        </Container>
    );
}

export default AdminRewards;
