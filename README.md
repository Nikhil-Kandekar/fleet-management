Fleet Management System
=======================

A scalable, real-time fleet management system designed to monitor vehicles using GPS, vehicle telemetry data, and dashcam footage. The system provides real-time analytics, incident alerts, and role-based dashboards to fleet operators.

Features
--------

-   **Real-Time Vehicle Tracking**: Monitor location, speed, fuel levels, and other telemetry data.
-   **Dashcam Footage Viewer**: Stream and store dashcam videos with metadata for retrieval.
-   **Role-Based Management**: User authentication and dashboards with role-specific views.
-   **Analytics Dashboard**: Visualize real-time and historical analytics (e.g., average speed, fuel consumption).
-   **Maps Integration**: Track vehicle routes and statuses with map overlays.

Relevant Frontend Components
----------------------------

### Functional Files

The following files are used in the `frontend` folder for the project:

1.  **Dashboard**: Displays the fleet overview, including vehicle statuses and notifications.
2.  **Analytics**: Provides detailed analytics and charts for telemetry data.
3.  **Login**: Handles user authentication and login functionality.
4.  **Register**: Allows new users to sign up for the system.
5.  **Video Playback**: Plays dashcam footage based on timestamps.

### Unused Files

All other files and components in the `frontend` folder are not currently used in the system.

Architecture
------------

The Fleet Management System follows a microservices-based architecture:

-   **Frontend**: React.js for interactive dashboards and real-time updates.
-   **Backend**: Node.js with Express for API endpoints and Kafka consumer-producer communication.
-   **Database**:
    -   **InfluxDB** for storing notifications and telemetry data.
    -   **Block Storage** (cloud/local) for video storage.
-   **Messaging Queue**: Apache Kafka for processing telemetry data and video streams.
-   **Deployment**: Supports local and cloud deployments with scalability in mind.

Setup Instructions
------------------

### Prerequisites

-   **Node.js** (v16 or higher)
-   **React.js** (latest version)
-   **Kafka** (local setup or cloud service)
-   **InfluxDB** (for telemetry and notification data)
-   **Docker** (optional for containerized deployments)

### Installation

1.  Clone the repository:

    bash

    Copy code

    `git clone https://github.com/Nikhil-Kandekar/fleet-management.git
    cd fleet-management`

2.  Install frontend dependencies:

    bash

    Copy code

    `cd frontend
    npm install`

3.  Start the frontend:

    bash

    Copy code

    `npm start`

### Environment Variables

Create a `.env` file in the `frontend` folder:

env

Copy code

`REACT_APP_BACKEND_URL=http://localhost:5000`

Contribution
------------

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-branch`).
3.  Commit changes (`git commit -m 'Add feature'`).
4.  Push to the branch (`git push origin feature-branch`).
5.  Open a pull request.

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.