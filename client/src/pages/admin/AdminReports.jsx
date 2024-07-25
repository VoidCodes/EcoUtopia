import axios from "axios";
import { useState, useEffect } from "react";
import {
  Container,
  Flex,
  Button,
  TextInput,
  Box,
  Anchor,
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  Title,
  Modal,
  LoadingOverlay,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPencil,
  IconTrash,
  IconDots,
} from "@tabler/icons-react";
import AdminNav from "../../components/AdminNav";

function AdminReports() {
  // create state to hold reports
  const [reports, setReports] = useState([]);
  // create state to hold loading status
  const [loading, setLoading] = useState(true);
  // create state to hold error status
  const [error, setError] = useState(null);
  // create state to hold modal status
  const [opened, { open, close }] = useDisclosure(false);
  // create state to hold selected report details
  const [selectedReport, setSelectedReport] = useState(null);

  // create function to fetch reports and add validation such that pending reports are shown first
  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/feedback");
      setReports(response.data.sort((a, b) => (a.status === "pending" ? -1 : 1)));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // create function to handle report status change
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/feedback/${id}`, { status });
      fetchReports();
    } catch (error) {
      setError(error);
    }
  };

  // create function to handle report deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchReports();
    } catch (error) {
      setError(error);
    }
  };

  // create function to handle modal close
  const handleClose = () => {
    close();
    setSelectedReport(null);
  };

  // create function to handle modal open
  const handleOpen = (report) => {
    setSelectedReport(report);
    open();
  };

  // create function to handle modal submit
  const handleSubmit = (id, status) => {
    handleStatusChange(id, status);
    handleClose();
  };

  // create effect to fetch reports
  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (reports.length === 0) return <Text align="center">No reports found</Text>;

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <AdminNav />
      <Title order={2} style={{ marginBottom: 20 }}>Admin Reports</Title>
      <Table>
        <thead>
          <tr>
            <th>User Email</th>
            <th>Question 1</th>
            <th>Question 2</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.userEmail}</td>
              <td>{report.question1}</td>
              <td>{report.question2}</td>
              <td>{report.status}</td>
              <td>
                <Group spacing="xs">
                  <ActionIcon onClick={() => handleOpen(report)}>
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => handleDelete(report.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => handleSubmit(report.id, 'approved')}>Approve</Menu.Item>
                      <Menu.Item onClick={() => handleSubmit(report.id, 'rejected')}>Reject</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedReport && (
        <Modal
          title="Report Details"
          opened={opened}
          onClose={handleClose}
          size="lg"
        >
          <Box>
            <Text>Email: {selectedReport.userEmail}</Text>
            <Text>Question 1: {selectedReport.question1}</Text>
            <Text>Question 2: {selectedReport.question2}</Text>
            <Text>Long Answer: {selectedReport.longAnswer}</Text>
            <Text>Problems Encountered: {selectedReport.problemsEncountered}</Text>
            {selectedReport.screenshot && (
              <Box mt="md">
                <Text>Screenshot:</Text>
                <img
                  src={`/uploads/${selectedReport.screenshot}`}
                  alt="Screenshot"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
            )}
            <Group position="right" mt="md">
              <Button onClick={() => handleSubmit(selectedReport.id, 'approved')}>Approve</Button>
              <Button color="red" onClick={() => handleSubmit(selectedReport.id, 'rejected')}>Reject</Button>
            </Group>
          </Box>
        </Modal>
      )}
    </Container>
  );
}

export default AdminReports;
