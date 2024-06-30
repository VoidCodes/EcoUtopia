import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Text, Group, Image, Stack, Loader, Center, Container, Modal } from '@mantine/core';
import { FaPlus } from "react-icons/fa";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/posts');
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3001/posts/${selectedPostId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            fetchPosts();
            setIsModalOpen(false); // Close the modal after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleReport = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3001/posts/${postId}/report`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error reporting post:', error);
        }
    };

    if (loading) return (
        <Center>
            <Loader />
        </Center>
    );
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Group position="apart" mb={20}>
                <h1>All Posts</h1>
                <Link to="/create-post">
                    <Button variant="outline" color="red">
                        <FaPlus />
                    </Button>
                </Link>
            </Group>
            <Container>
                <Stack className="posts-container" spacing="md">
                    {posts.length === 0 ? (
                        <p>No posts found.</p>
                    ) : (
                        posts.map(post => (
                            <Card key={post.post_id} shadow="sm" mb={20}>
                                <Group position="apart">
                                    <Group position="left">
                                        <Button
                                            variant="outline"
                                            color="red"
                                            onClick={() => {
                                                setSelectedPostId(post.post_id);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                        <Link to={`/edit/${post.post_id}`}>
                                            <Button variant="outline">Edit</Button>
                                        </Link>
                                    </Group>
                                    <Group position="right">
                                        <Text size="sm" color="dimmed">{post.resident ? post.resident.name : 'Anonymous'}</Text>
                                        <Text size="sm">{new Date(post.createdAt).toLocaleString()}</Text>
                                    </Group>
                                </Group>
                                <Text weight={500} size="lg" mt="md">{post.title}</Text>
                                <Text size="sm" color="dimmed">{post.tags ? post.tags : 'No Tags'}</Text>
                                {post.imageUrl && (
                                    <Image
                                        w={400}
                                        h={400}
                                        src={`http://localhost:3001${post.imageUrl}`}
                                    />
                                )}
                                <Text mt="md">{post.content}</Text>
                                <Group position="right" mt="md">
                                    <Button variant="light" onClick={() => handleReport(post.post_id)}>
                                        Report ({post.reports})
                                    </Button>
                                </Group>
                            </Card>
                        ))
                    )}
                </Stack>
            </Container>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Deletion"
            >
                <Text>Are you sure you want to delete this post?</Text>
                <Group position="apart" style={{ marginTop: 20 }}>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button color="red" onClick={handleDelete}>Confirm Delete</Button>
                </Group>
            </Modal>
        </div>
    );
};

export default Posts;
