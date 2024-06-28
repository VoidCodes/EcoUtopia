import axios from 'axios'
import { 
    Container,
    Text,
    Button,
    LoadingOverlay,
    Title,
    Box,
    TextInput,
    rem,
    Textarea,
    NumberInput,
    Notification,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom';

function EditReward() {
    const { rewardId } = useParams()
    const navigate = useNavigate()
    const [reward, setReward] = useState(null)
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        reward_name: '',
        reward_description: '',
        reward_points: '',
        reward_expiry: '',
    });

    const validateForm = () => {
        let errors = {};
        if (!formData.reward_name) errors.reward_name = 'Reward name is required';
        if (!formData.reward_description) errors.reward_description = 'Reward description is required';
        if (!formData.reward_points) errors.reward_points = 'Reward points is required';
        if (!formData.reward_expiry) errors.reward_expiry = 'Reward expiry is required';
        return errors;
    }

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/rewards/updateReward/${rewardId}`, formData)
            console.log(`Reward updated successfully: ${response.data}`); // eslint-disable-line no-console
            setSuccess(true);
            setErrorMessage('');
            setSuccess(true);
            setError(false)
            setFormErrors({});
            //navigate('/rewards')
        } catch (e) {
            console.error('Error:', JSON.stringify(error));
            setError(true)
            if (error.response) {
                const responseErrors = error.response.data.errors || {};
                setFormErrors(responseErrors);
                setErrorMessage(JSON.stringify(error.response.data));
            } else if (error.request) {
                setErrorMessage('Error: No response received from the server.');
            } else {
                setErrorMessage(`Error: ${error.message}`);
            }
        }
    }

    useEffect(() => {
        document.title = 'Edit Reward - EcoUtopia'
        const fetchReward = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/rewards/getReward/${rewardId}`)
                const fetchedReward = response.data
                setReward(fetchedReward)
                setFormData({
                    reward_name: fetchedReward.reward_name,
                    reward_description: fetchedReward.reward_description,
                    reward_points: fetchedReward.reward_points,
                    reward_expiry: fetchedReward.reward_expiry,
                })
                setLoading(false)
            } catch (error) {
                setError(error)
                setErrorMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchReward()
    }, [rewardId])

    if (loading) {
        return (
            <Container size="xl">
                <LoadingOverlay visible />
            </Container>
        )
    }

    if (error) {
        return (
            <Container size="xl">
                <Text c={'red'} align="center" size="xl" style={{ marginTop: 20 }}>
                    {error.message} 
                </Text>
            </Container>
        )
    }
    
    return (
        <Container size="xl">
            <Box padding="lg" style={{ marginBottom: 20 }} />
            <Title order={1} style={{ marginBottom: 20 }}>Edit Reward</Title>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <Box padding="lg" style={{ marginBottom: 20 }}>
                <TextInput
                    label="Reward Name"
                    placeholder="Enter reward name"
                    value={formData.reward_name}
                    onChange={(e) => setFormData({ ...formData, reward_name: e.currentTarget.value })}
                    error={formErrors.reward_name}
                    style={{ marginBottom: rem(1) }}
                    required
                />
                <Textarea
                    label="Reward Description"
                    placeholder="Enter reward description"
                    value={formData.reward_description}
                    onChange={(e) => setFormData({ ...formData, reward_description: e.currentTarget.value })}
                    error={formErrors.reward_description}
                    style={{ marginBottom: rem(1) }}
                    required
                />
                <NumberInput
                    label="Reward Points"
                    placeholder="Enter reward points"
                    value={formData.reward_points}
                    onChange={(e) => setFormData({ ...formData, reward_points: e.currentTarget.value })}
                    error={formErrors.reward_points}
                    style={{ marginBottom: rem(1) }}
                    required
                />
                <DateTimePicker
                    label="Reward Expiry"
                    placeholder="Select reward expiry"
                    value={formData.reward_expiry}
                    onChange={(value) => setFormData({ ...formData, reward_expiry: value })}
                    error={formErrors.reward_expiry}
                    style={{ marginBottom: rem(1) }}
                    required
                />
                <Button
                    onClick={handleSubmit}
                    color="teal"
                    style={{ marginTop: 20 }}
                >
                    Save Reward
                </Button>
            </Box>
            </form>
            {success && (
                <Notification
                    title="Reward updated successfully"
                    color="teal"
                    style={{ marginTop: 20 }}
                    onClose={() => navigate('/rewards')}
                />
            )}
            {errorMessage && (
                <Notification
                    title="Error updating reward"
                    color="red"
                    style={{ marginTop: 20 }}
                    onClose={() => setErrorMessage('')}
                >
                    {errorMessage}
                </Notification>
            )}
        </Container>
    )
}

export default EditReward