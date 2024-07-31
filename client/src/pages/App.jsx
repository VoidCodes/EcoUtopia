import Navbar from '../components/Navbar';
//import { useRef } from 'react';
//import { useDisclosure } from '@mantine/hooks';
//import { TimeInput } from '@mantine/dates';
//import { IconClock } from '@tabler/icons-react';
import { useEffect } from "react";
import { Container, Box, Card, Grid, Button, Group, Anchor, Text } from "@mantine/core"

function App() {

  useEffect(() => {
    document.title = "Home - EcoUtopia";
  });

  //const ref = useRef(null); 
  return (
    <Container maw={800} style={{marginTop: '1rem'}}>
      <Grid spacing="xl" display={'flex'} justifyContent={'center'} h={300}>
        {/*<Card shadow="xl" padding="xl" radius="xl">
          <Text align="center" size="xl" weight={700}>
            Welcome to EcoUtopia
          </Text>
          <Text align="center" size="lg">
            Your one-stop shop for all things sustainable
          </Text>
        </Card>*/}
        <Grid.Col span={{ xs: 12, sm: 8, md: 6 }}>
          <Card shadow="xl" padding="xl" radius="xl">
            <Text align="center" size="xl" weight={700}>
              Welcome to EcoUtopia
            </Text>
            <Text align="center" size="lg">
              Your one-stop shop for all things sustainable
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
      <Box padding="xl" style={{marginTop: '70px'}} />
      <Navbar />
      <Group>
        <Anchor href="/test">
          <Button color='deepBlue'>Click me</Button>
        </Anchor>
        <Anchor href="/testcreate">
          <Button color='blue'>Click me</Button>
        </Anchor>
        {/*<Anchor href="/admin/view-courses">
          <Button color='orange'>Click me</Button>
        </Anchor>*/}
      </Group>
    </Container>
  )
}

export default App