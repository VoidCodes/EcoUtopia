import axios from 'axios';
import { useState } from 'react';
import { Container } from '@mantine/core';
import Navbar from '../components/Navbar';

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;

    setFormData({
      ...formData,
      [name]: file || value,
    });

    if (name === 'screenshot' && file) {
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axios.post('/api/feedback', form);
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
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="Your Email"
          required
        />
        <label>
          Question 1 (0-10):
          <input
            type="range"
            name="question1"
            value={formData.question1}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.5"
          />
          <span>{formData.question1}</span>
        </label>
        <label>
          Question 2 (0-10):
          <input
            type="range"
            name="question2"
            value={formData.question2}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.5"
          />
          <span>{formData.question2}</span>
        </label>
        <textarea
          name="longAnswer"
          value={formData.longAnswer}
          onChange={handleChange}
          placeholder="Long Answer"
          required
        />
        <textarea
          name="problemsEncountered"
          value={formData.problemsEncountered}
          onChange={handleChange}
          placeholder="Problems Encountered"
        />
        <input type="file" name="screenshot" onChange={handleChange} />
        {screenshotPreview && (
          <div style={{ margin: '10px 0' }}>
            <p>Screenshot Preview:</p>
            <img src={screenshotPreview} alt="Screenshot Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
        <button type="submit">Submit Feedback</button>
      </form>
    </Container>
  );
}

export default Reports;
