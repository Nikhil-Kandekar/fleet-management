import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:6000/notifications`);
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              Time: {notification.timestamp}, Vehicle: {notification.vehicleId}, Alert: {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
