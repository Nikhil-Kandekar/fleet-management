import api from './api';

export const getTelemetryData = (vehicleId) => {
  return api.get('/telemetry', { params: { vehicleId } });
};

export const getNotifications = () => {
  return api.get('/notifications');
};
