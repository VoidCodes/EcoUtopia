import axios from "axios";
import dayjs from "dayjs";
import Navbar from "../../components/Navbar.jsx";
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Anchor,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Box,
  Avatar,
  LoadingOverlay,
  Flex,
} from "@mantine/core";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function formatMySQLTimeString(mysqlTimeString) {
    // Split the MySQL time string into hours, minutes, and seconds
    const [hours, minutes] = mysqlTimeString.split(':');
    
    // Convert hours from 24-hour to 12-hour format and determine AM/PM
    const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    let hours12 = parseInt(hours, 10) % 12;
    hours12 = hours12 ? hours12 : 12; // Convert hour '0' to '12'
    
    // Return the formatted time string with AM/PM
    return `${hours12}:${minutes} ${ampm}`;
  } 

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
  }, []);
  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (courses.length === 0) return <Text align="center">No courses found</Text>;

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
       <Box padding="xl" style={{marginTop: '70px'}} />
       <Navbar />
      <Text
        align="start"
        weight={700}
        style={{ fontSize: 30, marginBottom: 20 }}
        c="deepBlue"
        fw={500}
        size="xl"
      >
        Check out our courses
      </Text>
      <Grid>
        {courses.map((course) => (
          <Card
            key={course.course_id}
            shadow="xs"
            style={{ width: 300, margin: 10 }}
          >
            <Paper padding="md" style={{ position: "relative" }}>
              <Image
                src={null}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                alt="aa"
                h={200}
              />
              <Badge
                color={course.course_type === "Online" ? "blue" : "orange"}
                style={{ position: "absolute", bottom: 10, right: 10}}
              >
                {course.course_type}
              </Badge>
            </Paper>
            <Text 
            fw={700} 
            c={'purple'} 
            weight={700}>
              {dayjs(course.start_date).format("DD MMM YYYY")} | {formatMySQLTimeString(course.course_start_time)} - {formatMySQLTimeString(course.course_end_time)}
            </Text>
            <Text align="center" fw={700} style={{ margin: 10 }}>
              {course.course_name}
            </Text>
            <Flex justify="flex-start" align="center">
              <Box style={{ margin: 10 }}>
                <Flex justify="flex-start" align="center">
                  <Avatar radius="xl" size="md" alt="aa" />
                  <Text align="center" style={{ margin: 10 }}>
                    {course.course_instructor}
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Group justify="center">
              <Text weight={700}>Price : ${course.course_price}</Text>
              <Anchor style={{ textDecoration: 'none' }} href={`/course/${course.course_id}`}>
                <Button variant="filled" color="deepBlue" style={{ margin: 10 }}>
                  View Course
                </Button>
              </Anchor>
            </Group>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default Courses;
