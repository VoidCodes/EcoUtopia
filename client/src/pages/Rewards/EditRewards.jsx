
import axios from 'axios';
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
    Modal,
    Avatar,
    Progress,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditReward() {
    const { rewardId } = useParams();
    const navigate = useNavigate();
    const [reward, setReward] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        reward_name: '',
        reward_description: '',
        reward_points: '',
        reward_expiry: '',
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const validateForm = () => {
        let errors = {};
        if (!formData.reward_name) errors.reward_name = 'Reward name is required';
        if (!formData.reward_description) errors.reward_description = 'Reward description is required';
        if (!formData.reward_points) errors.reward_points = 'Reward points is required';
        if (!formData.reward_expiry) errors.reward_expiry = 'Reward expiry is required';
        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/rewards/updateReward/${rewardId}`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            console.log(`Reward updated successfully: ${response.data}`); // eslint-disable-line no-console
            setSuccess(true);
            setErrorMessage('');
            setError(false);
            setFormErrors({});
        } catch (e) {
            console.error('Error:', JSON.stringify(e));
            setError(true);
            if (e.response) {
                const responseErrors = e.response.data.errors || {};
                setFormErrors(responseErrors);
                setErrorMessage(JSON.stringify(e.response.data));
            } else if (e.request) {
                setErrorMessage('Error: No response received from the server.');
            } else {
                setErrorMessage(`Error: ${e.message}`);
            }
        }
    };

    useEffect(() => {
        document.title = 'Edit Reward - EcoUtopia';
        const fetchReward = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/rewards/getReward/${rewardId}`);
                const fetchedReward = response.data;
                setReward(fetchedReward);
                setFormData({
                    reward_name: fetchedReward.reward_name,
                    reward_description: fetchedReward.reward_description,
                    reward_points: fetchedReward.reward_points,
                    reward_expiry: fetchedReward.reward_expiry,
                });
                setLoading(false);
            } catch (error) {
                setError(error);
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReward();
    }, [rewardId]);

    if (loading) {
        return (
            <Container size="xl">
                <LoadingOverlay visible />
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="xl">
                <Text color="red" align="center" size="xl" style={{ marginTop: 20 }}>
                    {error.message}
                </Text>
            </Container>
        );
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
                        onChange={(value) => setFormData({ ...formData, reward_points: value })}
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
                        onClick={() => setPreviewOpen(true)}
                        color="blue"
                        style={{ marginTop: 20 }}
                    >
                        Preview Changes
                    </Button>
                    <Button
                        type="submit"
                        color="teal"
                        style={{ marginTop: 20 }}
                    >
                        Save Reward
                    </Button>
                </Box>
            </form>
            {uploadProgress > 0 && (
                <Progress value={uploadProgress} mt="md" />
            )}
            <Modal
                opened={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Preview Reward Changes"
            >
                <Text>Name: {formData.reward_name}</Text>
                <Text>Description: {formData.reward_description}</Text>
                <Text>Points: {formData.reward_points}</Text>
                <Text>Expiry: {formData.reward_expiry.toString()}</Text>
                <Button onClick={() => setPreviewOpen(false)} color="red" mt="md">
                    Close
                </Button>
            </Modal>
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
    );
}

export default EditReward;
