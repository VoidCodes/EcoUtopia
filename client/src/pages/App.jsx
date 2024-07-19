import { useDisclosure } from '@mantine/hooks';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import { Button, Container, Group, Anchor, Modal, Text, Box, ActionIcon, rem } from "@mantine/core"
import { useRef } from 'react';

function App() {
  const [opened, { open, close }] = useDisclosure(false);

  const ref = useRef(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

  return (
    <Container size={"xl"}>
      <Box padding="xl" style={{marginTop: '70px'}} />
      <Navbar />
      <Modal opened={opened} onClose={close} title="Welcome to EcoUtopia">
        <p>This is a modal window. You can use it to display some important information to the user.</p>
        <Group>
          <Button color='blue' onClick={close}>Close</Button>
        </Group>
      </Modal>
      <Text fw={700} size='xl' style={{ marginTop: 20 }}>EcoUtopia Home Page</Text>
      <p>Welcome to EcoUtopia home page. This page is under construction. There are buttons below for navigation.</p>
      <Group>
        <Anchor href="/test">
          <Button color='deepBlue'>Click me</Button>
        </Anchor>
        <Anchor href="/courses">
          <Button color='red'>Click me</Button>
        </Anchor>
        <Button onClick={open} color='green'>Click me</Button>
        <Anchor href="/admin/view-courses">
          <Button color='orange'>Click me</Button>
        </Anchor>
        <Anchor href="/admin/rewards">
          <Button color='teal'>Click me</Button>
        </Anchor>
      </Group>
      <TimeInput withSeconds label="Click icon to show browser picker" ref={ref} rightSection={pickerControl} w={250} />
    </Container>
  )
}

export default App
