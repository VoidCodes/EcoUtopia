import axios from "axios";
import { useState, useEffect } from "react";
import {
  Container,
  Select,
  Button,
  Group,
  Text,
  ActionIcon,
  Menu,
  Title,
  Modal,
  LoadingOverlay,
  Table,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash, IconDots } from "@tabler/icons-react";
import AdminNav from "../../components/AdminNav";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function AdminReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

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

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/feedback/${id}`, { status });
      fetchReports();
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchReports();
    } catch (error) {
      setError(error);
    }
  };

  const handleClose = () => {
    close();
    setSelectedReport(null);
  };

  const handleOpen = (report) => {
    setSelectedReport(report);
    open();
  };

  const handleSubmit = (id, status) => {
    handleStatusChange(id, status);
    handleClose();
  };

  const filterReports = (reports) => {
    let filteredReports = reports;

    if (filter) {
      switch (filter) {
        case "completed":
          filteredReports = reports.filter((report) => report.status === "approved");
          break;
        case "pending":
          filteredReports = reports.filter((report) => report.status === "pending");
          break;
        default:
          break;
      }
    }

    return filteredReports;
  };

  const sortReports = (reports) => {
    let sortedReports = [...reports];

    if (sortCriteria) {
      switch (sortCriteria) {
        case "alphabetical_az":
          sortedReports.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
          break;
        case "alphabetical_za":
          sortedReports.sort((a, b) => b.userEmail.localeCompare(a.userEmail));
          break;
        case "latest":
          sortedReports.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "oldest":
          sortedReports.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "shortest_time":
          sortedReports.sort((a, b) => a.timeTaken - b.timeTaken);
          break;
        case "longest_time":
          sortedReports.sort((a, b) => b.timeTaken - a.timeTaken);
          break;
        default:
          break;
      }
    }

    return sortedReports;
  };

  const aggregateReportsByDay = (reports) => {
    const aggregatedData = {};

    reports.forEach((report) => {
      const date = dayjs(report.date).format("YYYY-MM-DD");
      if (!aggregatedData[date]) {
        aggregatedData[date] = 1;
      } else {
        aggregatedData[date]++;
      }
    });

    return Object.entries(aggregatedData).map(([date, count]) => ({
      date,
      count,
    }));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <LoadingOverlay visible />;
  if (error) return <Text align="center">Error: {error.message}</Text>;
  if (reports.length === 0) return <Text align="center">No reports found</Text>;

  const filteredReports = filterReports(reports);
  const sortedReports = sortReports(filteredReports);
  const aggregatedReports = aggregateReportsByDay(reports);

  return (
    <Container size="xl" style={{ marginTop: 20 }}>
      <AdminNav />
      <Title order={2} style={{ marginBottom: 20 }}>Admin Reports</Title>

      <Group direction="column" spacing="sm" style={{ marginBottom: 20 }}>
        <Select
          data={[
            { value: "", label: "All" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
          ]}
          placeholder="Filter by Status"
          value={filter}
          onChange={(value) => setFilter(value)}
        />
        <Select
          data={[
            { value: "alphabetical_az", label: "Alphabetical (A-Z)" },
            { value: "alphabetical_za", label: "Alphabetical (Z-A)" },
            { value: "latest", label: "Latest" },
            { value: "oldest", label: "Oldest" },
            { value: "shortest_time", label: "Shortest Time Taken" },
            { value: "longest_time", label: "Longest Time Taken" },
          ]}
          placeholder="Sort by"
          value={sortCriteria}
          onChange={(value) => setSortCriteria(value)}
        />
        <Button onClick={() => {}}>Apply Filters</Button>
      </Group>

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
          {sortedReports.map((report) => (
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

      <Title order={3} style={{ marginTop: 20, marginBottom: 10 }}>Reports Summary</Title>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Number of Reports</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedReports.map(({ date, count }) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{count}</td>
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
