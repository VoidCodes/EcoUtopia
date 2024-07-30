import axios from 'axios';
import { useState } from 'react';
import { Container, Paper, Text, Button, Image, Group, TextInput, Textarea, Progress, Modal, ActionIcon } from '@mantine/core';
import Navbar from '../components/Navbar';
import { IconAlertCircle, IconX } from '@tabler/icons-react';

function Reports() {
  const [formData, setFormData] = useState({
    userEmail: '',
    question1: 5,
    question2: 5,
    longAnswer: '',
    problemsEncountered: '',
    screenshot: null,
  });

  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;

    // Real-time Validation
    if (name === 'screenshot' && file && file.size > 5242880) { // 5MB limit
      setFileSizeError(true);
      return;
    } else {
      setFileSizeError(false);
    }

    setFormData({
      ...formData,
      [name]: file || value,
    });

    if (name === 'screenshot' && file) {
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!/\S+@\S+\.\S+/.test(formData.userEmail)) errors.userEmail = 'Invalid email address';
    if (!formData.userEmail) errors.userEmail = 'Your email is required';
    if (!formData.longAnswer) errors.longAnswer = 'Long answer is required';
    if (formData.question1 < 0 || formData.question1 > 10) errors.question1 = 'Question 1 must be between 0 and 10';
    if (formData.question2 < 0 || formData.question2 > 10) errors.question2 = 'Question 2 must be between 0 and 10';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    setLoading(true);
    try {
      await axios.post('/api/feedback', form, {
        onUploadProgress: (progressEvent) => {
          // Handle progress indicator here if needed
        }
      });
      alert('Feedback submitted successfully!');
      setFormData({
        userEmail: '',
        question1: 1,
        question2: 1,
        longAnswer: '',
        problemsEncountered: '',
        screenshot: null,
      });
      setScreenshotPreview(null);
      setFormErrors({});
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setFormData({
      userEmail: '',
      question1: 1,
      question2: 1,
      longAnswer: '',
      problemsEncountered: '',
      screenshot: null,
    });
    setScreenshotPreview(null);
    setFormErrors({});
    setShowResetModal(false);
  };

  return (
    <Container size="sm" style={{ marginTop: 20 }}>
      <Navbar />
      <Paper padding="lg" style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
        <Text align="center" size="xl" weight={700} style={{ marginBottom: '1rem' }}>
          Submit Your Feedback
        </Text>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            label="Your Email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={{ fontSize: '1rem' }}
            error={formErrors.userEmail}
          />
          <div style={{ textAlign: 'center' }}>
            <Text size="lg" weight={500} style={{ marginBottom: '0.5rem' }}>
              Question 1 (0-10)
            </Text>
            <input
              type="range"
              name="question1"
              value={formData.question1}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.5"
              style={{ width: '100%', margin: '0.5rem 0' }}
            />
            <Text size="lg">{formData.question1}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="lg" weight={500} style={{ marginBottom: '0.5rem' }}>
              Question 2 (0-10)
            </Text>
            <input
              type="range"
              name="question2"
              value={formData.question2}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.5"
              style={{ width: '100%', margin: '0.5rem 0' }}
            />
            <Text size="lg">{formData.question2}</Text>
          </div>
          <Textarea
            label="Long Answer"
            name="longAnswer"
            value={formData.longAnswer}
            onChange={handleChange}
            placeholder="Enter your long answer"
            required
            style={{ minHeight: '100px' }}
            error={formErrors.longAnswer}
          />
          <Textarea
            label="Problems Encountered"
            name="problemsEncountered"
            value={formData.problemsEncountered}
            onChange={handleChange}
            placeholder="Describe the problems you encountered"
            style={{ minHeight: '100px' }}
          />
          <input
            type="file"
            name="screenshot"
            onChange={handleChange}
            style={{ margin: '0.5rem 0' }}
          />
          {fileSizeError && (
            <Text color="red" align="center" size="sm" style={{ margin: '10px 0' }}>
              File size exceeds 5MB limit.
            </Text>
          )}
          {screenshotPreview && (
            <div style={{ margin: '10px 0', textAlign: 'center' }}>
              <p>Screenshot Preview:</p>
              <Image src={screenshotPreview} alt="Screenshot Preview" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
          <Group position="apart" style={{ marginTop: '1rem' }}>
            <Button type="button" onClick={handleReset} color="red" variant="outline">
              Reset Form
            </Button>
            <Button type="submit" color="blue">
              Submit Feedback
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Reset Confirmation Modal */}
      <Modal
        opened={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Confirm Reset"
      >
        <Text size="sm">Are you sure you want to reset the form? All unsaved changes will be lost.</Text>
        <Group position="right" style={{ marginTop: '1rem' }}>
          <Button onClick={() => setShowResetModal(false)} color="gray">
            Cancel
          </Button>
          <Button onClick={confirmReset} color="red">
            Confirm
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default Reports;
