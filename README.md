# Fleet Management System
=======================

A scalable, real-time fleet management system designed to monitor vehicles using GPS, vehicle telemetry data, and dashcam footage. The system provides real-time analytics, incident alerts, and role-based dashboards to fleet operators.

Features
--------

-   **Real-Time Vehicle Tracking**: Monitor location, speed, fuel levels, and other telemetry data.
-   **Dashcam Footage Viewer**: Stream and store dashcam videos with metadata for retrieval.
-   **Role-Based Management**: User authentication and dashboards with role-specific views.
-   **Accident Alerts**: Analyze sudden speed drops to detect potential accidents and notify operators.
-   **Push Notifications**: Store notifications in InfluxDB and display them on the frontend.
-   **Analytics Dashboard**: Visualize real-time and historical analytics (e.g., average speed, fuel consumption).
-   **Maps Integration**: Track vehicle routes and statuses with map overlays.

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

System Workflow
---------------

1.  **Telemetry Data Pipeline**:
    -   Kafka producer sends vehicle telemetry data (e.g., GPS, speed, fuel).
    -   Kafka consumer stores data in InfluxDB.
2.  **Dashcam Footage Handling**:
    -   Kafka producer streams 10-second dashcam video chunks.
    -   Consumer renames and stores videos with timestamps in block storage.
    -   Frontend retrieves videos by timestamp for user playback.
3.  **Real-Time Analytics**:
    -   Analyze telemetry data for trends like mileage, accident detection, and fuel efficiency.
    -   Push analytics and alerts to the dashboard.

Setup Instructions
------------------

### Prerequisites

-   **Node.js** (v16 or higher)
-   **React.js** (latest version)
-   **Kafka** (local setup or cloud service)
-   **InfluxDB** (for telemetry and notification data)
-   **MongoDB** (optional for user management if JWT-based login is implemented)
-   **Docker** (optional for containerized deployments)

### Installation

1.  Clone the repository:

    bash

    Copy code

    `git clone https://github.com/Nikhil-Kandekar/fleet-management.git
    cd fleet-management`

2.  Install backend dependencies:

    bash

    Copy code

    `cd backend
    npm install`

3.  Install frontend dependencies:

    bash

    Copy code

    `cd frontend
    npm install`

4.  Start services:

    -   **Kafka**: Follow Kafka documentation for local setup.
    -   **InfluxDB**: Set up using Docker or local installation with username `admin` and password `nbknbknbk`.
    -   **Backend**:

        bash

        Copy code

        `cd backend
        npm start`

    -   **Frontend**:

        bash

        Copy code

        `cd frontend
        npm start`

### Environment Variables

Create a `.env` file in the `backend` folder:

env

Copy code

`KAFKA_BROKER=localhost:9092
INFLUXDB_URL=http://localhost:8086
INFLUXDB_USERNAME=admin
INFLUXDB_PASSWORD=nbknbknbk
BLOCK_STORAGE_PATH=/path/to/block/storage
JWT_SECRET=your_jwt_secret`

### API Endpoints

#### Backend

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/vehicles` | GET | Get vehicle telemetry data. |
| `/api/dashcam/video` | GET | Fetch dashcam footage by timestamp. |
| `/api/notifications` | GET | Get notifications from InfluxDB. |

#### Frontend

React app connects to the backend and provides real-time visualizations, maps, and dashboards.

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