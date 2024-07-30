import { useState } from "react";
import { Container, Select, Button, Group, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function FilterPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  const applyFilters = () => {
    navigate("/admin/reports", { state: { filter, sortCriteria } });
  };

  return (
    <Container size="sm" style={{ marginTop: 20 }}>
      <Title order={2} style={{ marginBottom: 20 }}>Filter and Sort Reports</Title>

      <Group direction="column" spacing="sm">
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
        <Button onClick={applyFilters}>Apply Filters</Button>
      </Group>
    </Container>
  );
}

export default FilterPage;
