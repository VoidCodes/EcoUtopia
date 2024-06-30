import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, TextInput, Textarea, Container, Modal, Text, Group } from '@mantine/core';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${id}`);
                const postData = response.data;
                setTitle(postData.title);
                setContent(postData.content);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        fetchPostData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedPost = {
            title,
            content
        };

        try {
            const response = await axios.put(`http://localhost:3001/posts/${id}`, updatedPost, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Redirect to posts page after successful update
                navigate('/posts');
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
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
            <h1>Edit Post</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
            }}>
                <TextInput
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', width: '100%' }}
                />
                <Textarea
                    label="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', width: '100%' }}
                />
                <Button type="submit" fullWidth>
                    Update Post
                </Button>
            </form>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Update"
            >
                <Text>Are you sure you want to update this post?</Text>
                <Group position="apart" style={{ marginTop: 20 }}>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button color="blue" onClick={handleUpdate}>Confirm Update</Button>
                </Group>
            </Modal>
        </Container>
    );
};

export default EditPost;
