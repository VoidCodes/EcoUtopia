import https from '../https'
import global from '../global';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { FaRegEye } from "react-icons/fa6";
import LoaderComponent from '../components/Loader.jsx';
import Navbar from '../components/Navbar.jsx'
import {
  Container,
  Grid,
  Anchor,
  Card,
  Text,
  Button,
  Group,
  Box,
  SegmentedControl,
} from "@mantine/core";

function Orders() {
  const [orderslist, setOrdersList] = useState([]);
  const [filter, setFilter] = useState('Upcoming');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Display loader for at least 0.3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    https.get('/orders').then((res) => {
      console.log(res.data);
      setOrdersList(res.data);
    });
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredOrders = orderslist.filter((order) => {
    if (filter === 'Upcoming') return order.order_status === 'Upcoming';
    if (filter === 'Completed') return order.order_status === 'Completed';
    if (filter === 'Refunded') return order.order_status === 'Refunded';
    return true;
  });

  const getCardStyle = (status) => {
    switch (status) {
      case 'Upcoming':
        return { backgroundColor: '#F4B400' };
      case 'Completed':
        return { backgroundColor: '#0F9D58' };
      case 'Refunded':
        return { backgroundColor: '#DB4437' };
      default:
        return {};
    }
  };

  if (!orderslist.length && isLoading) {
    return <LoaderComponent />;
  }

  return (
    <Container size="xl" style={{ marginTop: '70px' }}>
      <Box style={{ marginTop: '70px' }} />
      <Navbar />
      <Text
        align="start"
        weight={700}
        style={{ fontSize: 30, marginBottom: 20 }}
        c="deepBlue"
        fw={500}
        size="xl"
      >
        Orders
      </Text>
      <Group position="apart" style={{ marginBottom: 20 }}>
        <SegmentedControl
          value={filter}
          onChange={handleFilterChange}
          data={[
            { label: 'Upcoming', value: 'Upcoming' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Refunded', value: 'Refunded' },
          ]}
        />
        <Anchor component={Link} to="/courses">
          <Button color="deepBlue" style={{ marginLeft: 'auto' }}>Add Order</Button>
        </Anchor>
      </Group>
      <Grid>
        {filteredOrders.map((order, i) => (
          <Grid.Col span={4} key={i}>
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ ...getCardStyle(order.order_status), height: '100%' }}>              
              <Group position="apart">
              <Text weight={500} size="lg" style={{ color: 'white' }}>Order {order.order_id}</Text>
              {filter === 'Upcoming' && (
                <Anchor component={Link} to={`/editorders/${order.order_id}`} style={{ textDecoration: 'none' }}>
                  <Button size="xs" color="white" variant="outline">
                    <CiEdit />
                  </Button>
                </Anchor>
              )}
              <Anchor component={Link} to={`/orderdetails/${order.order_id}`} style={{ textDecoration: 'none' }}>
                <Button size="xs" color="white" variant="outline">
                  <FaRegEye />
                </Button>
              </Anchor>
            </Group>
              <Text mt="sm" style={{ color: 'white' }}>Course Title: {order.Course.course_name}</Text>
              <Text style={{ color: 'white' }}>Status: {order.order_status}</Text>
              <Text style={{ color: 'white' }}>Date: {dayjs(order.order_date).format(global.datetimeFormat)}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default Orders;