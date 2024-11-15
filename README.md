# Fleet Management System

This repository contains **Fleet Management System** services. The system includes services for user management, telemetry data streaming, Kafka-based message brokering, and a React-based frontend for visualization.

## Key Features

### User Management
- Role-based access control.
- Integrated InfluxDBS backend.

### Telemetry Analytics
- Streaming and storage of telemetry data using InfluxDB.
- Analytics-ready setup with bucket and retention policies.

### Dashcam Footage
- Producer and consumer pipelines.
- Metadata stored in InfluxDB for retrieval and analysis.

### Scalable Messaging
- Kafka as a backbone for real-time data pipelines.
- Zookeeper for reliable Kafka coordination.

### User-Friendly Frontend
- Interactive React interface.
- API integration for seamless user experience.

## Services Overview

The `docker-compose.yaml` defines the following services:

### Core Services
- **user-management-service**: Handles user-related operations with role-based access.
- **user-management-db**: InfluxDB instance for storing user and role data.
- **telemetry-influxdb**: InfluxDB instance for telemetry data storage and analytics.

### Messaging and Stream Processing
- **zookeeper**: Manages configuration and synchronization for Kafka.
- **kafka**: Message broker for telemetry and dashcam data.

### Telemetry Services
- **telemetry-service**: Processes and streams telemetry data to InfluxDB.
- **producer-service**: Produces telemetry data to Kafka.

### Dashcam Services
- **dashcam-producer**: Streams dashcam footage to Kafka.
- **dashcam-consumer**: Consumes dashcam footage and stores metadata in InfluxDB.
- **dashcam-api**: Provides APIs to access dashcam footage and metadata.

### Frontend
- **frontend**: React-based web application served via Nginx.

---

## Prerequisites

Ensure you have the following installed:
- Docker
- Docker Compose

---

## Usage
1. **Clone Repository**:
   ```bash
   git clone https://github.com/Nikhil-Kandekar/fleet-management
   cd fleet-management

2. **Start the services**:

   Run the following command to build and start all the services defined in `docker-compose.yaml`:

   ```bash
   docker-compose up --build

3. **Access the application**:

   Once the services are up and running, you can access the following components:

   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **User Management Service**: [http://localhost:5000](http://localhost:5000)
   - **Telemetry Service**: [http://localhost:6000](http://localhost:6000)
   - **Dashcam API**: [http://localhost:7000](http://localhost:7000)
   - **InfluxDB Dashboard**: [http://localhost:8087](http://localhost:8087)
