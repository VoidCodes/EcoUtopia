import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function EditOrders() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      http.get(`/orders/${orderId}`).then((res) => {
        setOrder(res.data);
      });
    }
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-order-container">
      <h1>Edit Order {order.order_id}</h1>
      <div className="order-details">
        <p>
          <strong>Course Title:</strong> {order.Course.course_name}
        </p>
        <p>
          <strong>Order Status:</strong> {order.order_status}
        </p>
        <p>
          <strong>Order Date:</strong> {dayjs(order.order_date).format(global.datetimeFormat)}
        </p>
        {/* Add more fields as necessary */}
      </div>
    </div>
  );
}

export default EditOrders;
