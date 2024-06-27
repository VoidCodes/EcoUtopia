import axios from "axios";
import dayjs from "dayjs";
import Navbar from "../components/Navbar.jsx";
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
  LoadingOverlay,
 } from "@mantine/core";
import { useState, useEffect } from "react";

function ViewRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/rewards/getRewards"
        );
        setRewards(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchRewards();
    document.title = "Rewards - EcoUtopia";
  }, []);

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (rewards.length === 0) return <Text align="center">No courses found</Text>;

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
        Check out our cool rewards!
      </Text>
      <Grid>
        {rewards.map((course) => (
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
            <Text align="center" fw={700} style={{ margin: 10 }}>
              {course.course_name}
            </Text>
            <Text align="center" style={{ margin: 10 }}>
              {course.course_description}
            </Text>
            <Group grow justify="center">
              <Text weight={700}>Price : ${course.course_price}</Text>
              <Anchor style={{ textDecoration: 'none' }} href={`/course/${course.course_id}`}>
                <Button fullWidth color="deepBlue" style={{ margin: 10 }}>
                  View Course
                </Button>
              </Anchor>
            </Group>
          </Card>
        ))}
      </Grid>
    </Container>
  )
}

export default ViewRewards;