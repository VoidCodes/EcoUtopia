import https from '../../http'
import dayjs from 'dayjs'
import global from '../../global'
import LoaderComponent from '../../components/Loader'
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Text,
  Button,
  Modal,
  Group,
} from '@mantine/core';
import { TiArrowBack } from "react-icons/ti";

function EditOrders() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Display loader for at least 0.3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (orderId) {
      https.get(`/orders/${orderId}`).then((res) => {
        setOrder(res.data);
      });
    }
  }, [orderId]);

  const handleRefund = () => {
    https.put(`/orders/${orderId}`).then((res) => {
      setOrder(res.data);
      setIsModalOpen(false); // Close the modal
      navigate('/orders'); // Navigate back to the orders page
    });
  };

  if (isLoading || !order) {
    return <LoaderComponent />;
  }

  return (
    <Container size="md" style={{ marginTop: 20 }}>
      <Group position="apart" mb={30}>
        <Button component={Link} to="/orders" variant="link">
          <TiArrowBack />
        </Button>
        <Text
          align="start"
          weight={700}
          style={{ fontSize: 30 }}
          c="deepBlue"
          fw={500}
          size="xl"
        >
          Refund Order {order.order_id}
        </Text>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="lg" fw={700}>
          Course Title: <Text component='span'>{order.Course.course_name}</Text>
        </Text>
        <Text size="lg" fw={700}>
          Order Status: <Text component='span'>{order.order_status}</Text>
        </Text>
        <Text size="lg" fw={700}>
          Order Date: <Text component='span'>{dayjs(order.order_date).format(global.datetimeFormat)}</Text>
        </Text>
        <Text size="lg" fw={700}>
          Instructor: <Text component='span'>{order.Course.course_instructor}</Text>
        </Text>
        <Text size="lg" fw={700}>
          Course Description: <Text component='span'>{order.Course.course_description}</Text>
        </Text>
        <Text size="lg" fw={700}>
          Course Date: <Text component='span'>{dayjs(order.Course.course_date).format(global.dateFormat)}</Text>
        </Text>
        <Text size="lg" fw={700}>
          Start Time: <Text component='span'>{order.Course.course_start_time}</Text>
        </Text>
        <Text size="lg" fw={700}>
          End Time: <Text component='span'>{order.Course.course_end_time}</Text>
        </Text>
        <Button
          variant="outline"
          color="red"
          style={{ marginTop: 20 }}
          onClick={() => setIsModalOpen(true)}
        >
          Refund Order
        </Button>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Refund"
      >
        <Text>Are you sure you want to refund this order?</Text>
        <Group position="apart" style={{ marginTop: 20 }}>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleRefund}>Confirm Refund</Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default EditOrders;