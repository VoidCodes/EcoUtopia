import http from '../http.js';
import dayjs from 'dayjs';
import global from '../global.js';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text, Container, Card, Button, Group } from '@mantine/core';
import { TiArrowBack } from "react-icons/ti";
import LoaderComponent from '../components/Loader.jsx';

function ViewOrders() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            http.get(`/orders/${orderId}`).then((res) => {
                setOrder(res.data);
            });
        }
    }, [orderId]);

    useEffect(() => {
        let timer = setTimeout(() => {
            setIsLoading(false);
        }, 300); // Display loader for at least 0.3 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!order) {
        return <LoaderComponent />;
    }

    if (isLoading) {
        return <LoaderComponent />;
    }

    return (
        <Container size="md" style={{ marginTop: 20, textAlign: 'center' }}>
            <Group position="apart" mb={30}>
                <Button component={Link} to="/orders" variant="link">
                    <TiArrowBack />
                </Button>
                <Text
                    align="start"
                    weight={700}
                    style={{ fontSize: 30 }}
                    color="deepBlue"
                    fw={500}
                    size="xl"
                >
                    View Order {order.order_id}
                </Text>
            </Group>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text size="lg" fw={'700'} >
                    Course Title: <Text component='span' size="lg">{order.Course.course_name}</Text>
                </Text>
                <Text size="lg" fw={'700'} >
                    Order Status: <Text component='span' size="lg">{order.order_status}</Text>
                </Text>
                <Text size="lg" fw={'700'}>
                    Order Date: <Text component='span' size="lg">{dayjs(order.order_date).format(global.datetimeFormat)} </Text>
                </Text>
                <Text size="lg" fw={'700'}>
                    Instructor: <Text component='span' size="lg"> {order.Course.course_instructor} </Text>
                </Text>
                <Text size="lg" fw={'700'}>
                    Course Description: <Text component='span' size="lg">{order.Course.course_description} </Text>
                </Text>
                <Text size="lg" fw={'700'}>
                    Course Date: <Text component='span' size='lg'>{dayjs(order.Course.course_date).format(global.dateFormat)} </Text>
                </Text>
                <Text size="lg" fw={'700'}>
                    Start Time: <Text component='span' size='lg'>{order.Course.course_start_time} </Text>
                </Text>
                <Text size="lg" fw={'700'}>
                    End Time: <Text component='span' size='lg'>{order.Course.course_end_time} </Text>
                </Text>
            </Card>
        </Container>
    );
}

export default ViewOrders;