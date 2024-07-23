import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoaderComponent from '../../components/Loader';
import Navbar from '../../components/Navbar';
import { Card, Button, Text, Group, Image, Stack, Container, Modal } from '@mantine/core';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const handleReport = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/api/posts/${postId}/report`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error reporting post:', error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/posts/getPosts'); // Adjust URL as needed
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to fetch posts');
                setLoading(false);
            }
        };
        fetchPosts();
        document.title = "Posts - EcoUtopia";
    }, []);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/api/posts/getPost/${selectedPostId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            //fetchPosts();
            setIsModalOpen(false); // Close the modal after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    if (loading) return <LoaderComponent />;
    if (error) return <Text align="center">Error: {error}</Text>;

    return (
        <>
        <Navbar />
        <Text align="center" size="xl" weight={700} mt={20}>
            Posts
        </Text>
        <Button variant="light" style={{ marginLeft: 20 }}>
            <Link to="/create">Create Post</Link>
        </Button>
        <Container>
            <Stack className="posts-container" spacing="md">
                {posts.length === 0 ? (
                    <Text align="center">No posts found</Text>
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
        </>
    );
};

export default Posts;