import axios from 'axios';
import { useState } from 'react';
import { Button, TextInput, Textarea, Select, Container } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const CreatePost = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('Advice');
    const [image, setImage] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', tags);
        if (image) {
          formData.append('image', image);
        }

        try {
          const token = localStorage.getItem('token');
          console.log('Token:', token); // Add this line to log the token
          const response = await axios.post('http://localhost:3001/posts/createPost', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 201) {
            navigate('/posts');
          } else {
            throw new Error('Failed to create post');
          }
        } catch (error) {
          console.error('Error creating post:', error);
          // Handle error, show error message, etc.
        }
      };

    return (
        <Container size="lg">
            <Link to="/posts">
                <Button variant="outline" style={{ marginBottom: '1rem' }}>
                    Back to Posts
                </Button>
            </Link>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ marginBottom: '1rem' }}
                    placeholder='Enter the title of your post...'
                />
                <Textarea
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ marginBottom: '1rem' }}
                    placeholder='Write your post here...'
                />
                <Select
                    label="Tags"
                    value={tags}
                    onChange={(setTags)}
                    data={[
                        { value: 'Advice', label: 'Advice' },
                        { value: 'Discussion', label: 'Discussion' },
                        { value: 'Question', label: 'Question' },
                    ]}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <Button
                    variant="outline"
                    component="label"
                    style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
                >
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Button>
                <Button type="submit" fullWidth>
                    Create Post
                </Button>
            </form>
        </Container>
    );
};

export default CreatePost;