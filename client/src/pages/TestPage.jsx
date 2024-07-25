import { Container, Button, HoverCard, Text, Group, FileInput } from "@mantine/core"
import { useEffect } from "react"

function TestPage() {
    useEffect(() => {
        document.title = "Test Page - EcoUtopia"
    }, [])
  return (
    <Container size={"xl"}>
      <h1>Test Page</h1>
      <h2>I feel so sigma!</h2>
      <p>This is a test page.</p>
      <Button>Click me</Button>
      <HoverCard shadow="md">
        <HoverCard.Target>
          <Button>Hover me</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <p>Test</p>
        </HoverCard.Dropdown>
      </HoverCard>
      <Group style={{ marginTop: 20 }} direction="column" spacing="xs">
        <Text size="xl" fw={700}>File Upload section:</Text>
        <form action="/api/upload" method="post" encType="multipart/form-data">
          <input type="file" name="file" />
          <Button type="submit">Upload</Button>
        </form>
      </Group>
    </Container>
  )
}

export default TestPage