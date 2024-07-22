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
    const { state, handlers } = useDisclosure();

    // create function to fetch reports and add validation such that peding reports are shown first
    const fetchReports = async () => {
        try {
            const response = await axios.get("/api/feedback");
            setReports(response.data.sort((a, b) => a.status === "pending" ? -1 : 1));
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
        handlers.hide();
    };

    // create function to handle modal open
    const handleOpen = () => {
        handlers.show();
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


}

export default AdminReports;