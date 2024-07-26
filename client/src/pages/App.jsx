import axios from "axios";
import Navbar from '../components/Navbar';
//import { useRef } from 'react';
//import { useDisclosure } from '@mantine/hooks';
//import { TimeInput } from '@mantine/dates';
//import { IconClock } from '@tabler/icons-react';
import { useState, useEffect } from "react";
import { Button, Flex, Card, Image, Badge, Container, Group, Anchor, Text, Box, LoadingOverlay } from "@mantine/core"

function App() {
  //const [opened, { open, close }] = useDisclosure(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/courses/getCourses"
        );
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchCourses();
    document.title = "Courses - EcoUtopia";
  });
  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (courses.length === 0) return <Text align="center">No courses found</Text>;

  //const ref = useRef(null); 
  return (
    <Container size={"xl"}>
      <Box padding="xl" style={{marginTop: '70px'}} />
      <Navbar />
      {/*<Modal opened={opened} onClose={close} title="Welcome to EcoUtopia">
        <p>This is a modal window. You can use it to display some important information to the user.</p>
        <Group>
          <Button color='blue' onClick={close}>Close</Button>
        </Group>
      </Modal>*/}
      <Group>
        <Anchor href="/test">
          <Button color='deepBlue'>Click me</Button>
        </Anchor>
        {/*<Anchor href="/courses">
          <Button color='red'>Click me</Button>
        </Anchor>*/}
        {/*<Button onClick={open} color='green'>Click me</Button> */}
        <Anchor href="/admin/view-courses">
          <Button color='orange'>Click me</Button>
        </Anchor>
        {/*<Anchor href="/admin/rewards">
          <Button color='teal'>Click me</Button>
        </Anchor> */}
      </Group>
      <Text 
        align={"left"}
        size={"xl"}
        fw={700}
        >Featured Courses
      </Text>
      <Flex>
        {courses.map((course) => (
          <Card key={course.course_id} shadow="xs" padding="md" style={{ width: 300, margin: 10 }}>
            <Image src={course.course_image_url} alt={course.course_name} height={200} />
            <Text align={"center"} size={"xl"} fw={700}>{course.course_name}</Text>
            <Text align={"center"} size={"xl"} fw={700}>{course.course_description}</Text>
            <Text align={"center"} size={"xl"} fw={700}>{course.price}</Text>
            <Badge color="blue" style={{ margin: 5 }}>{course.category}</Badge>
          </Card>
        ))}
      </Flex>
      <Box padding="xl" />
      <Text
        align={"left"}
        size={"xl"}
        fw={700}
        >Featured Rewards
      </Text>
      {/*<TimeInput withSeconds label="Click icon to show browser picker" ref={ref}  w={250} />*/}
    </Container>
  )
}

export default App