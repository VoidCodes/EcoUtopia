import axios from 'axios';
import {
  Container,
  Text,
  Button,
  LoadingOverlay,
  Paper,
  Grid,
  Image,
  Group,
  Title,
  Badge,
  Divider,
  Tabs,
  Rating,
  Box,
  Space,
} from '@mantine/core';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function ViewCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Course Details - EcoUtopia';
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/courses/getCourse/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleAddToOrder = () => {
    axios.post('/orders/addCourse', { course_id: courseId })
      .then((res) => {
        window.location.href = '/orders';
      })
      .catch((error) => {
        console.error("There was an error adding the course to the order!", error);
      });
  };

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
        <Text c="red" align="center" size="xl" style={{ marginTop: 20 }}>
          {error.message}
        </Text>
      </Container>
    );
  }

  if (!course) return <p>Loading...</p>;

  return (
    <Container size="xl" style={{ marginTop: 30 }}>
      <Paper padding="xl" shadow="md" radius="md" withBorder>
        <Title align="center" order={1} mb="md">
          {course.course_name}
        </Title>
        <Divider mb="lg" />
        <Grid gutter="xl">
          <Grid.Col span={6}>
            <Image
              src={course.course_image_url}
              alt={course.course_name}
              fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              height={350}
              fit="cover"
              radius="md"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Box>
              <Badge color="teal" size="lg" mb="sm">
                Best Seller
              </Badge>
              <Rating value={4.5} readOnly mb="sm" />
              <Text size="lg" mb="md">
                {course.course_description}
              </Text>
              <Text size="xl" weight={700} mb="md">
                Price: ${course.course_price}
              </Text>
              <Button
                size="lg"
                radius="md"
                onClick={handleAddToOrder}
              >
                Buy Course
              </Button>
            </Box>
          </Grid.Col>
        </Grid>
        <Divider my="lg" />
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="curriculum">Curriculum</Tabs.Tab>
            <Tabs.Tab value="instructor">Instructor</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="xs">
            <Text>
              {course.course_long_description || 'No additional information available.'}
            </Text>
          </Tabs.Panel>

          <Tabs.Panel value="curriculum" pt="xs">
            <Text>
              {/* Placeholder curriculum content */}
              <ul>
                <li>Introduction to the course</li>
                <li>Module 1: Getting Started</li>
                <li>Module 2: Advanced Topics</li>
              </ul>
            </Text>
          </Tabs.Panel>

          <Tabs.Panel value="instructor" pt="xs">
            <Group direction="row" align="center">
              <Image
                src={course.instructor_image_url}
                alt={course.course_instructor}
                radius="xl"
                width={100}
              />
              <Text size="lg">{course.course_instructor}</Text>
            </Group>
            <Text mt="xs">
              {course.instructor_bio || 'Instructor information is not available at the moment.'}
            </Text>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

export default ViewCourse;
