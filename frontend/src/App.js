import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VehicleDetail from './pages/VehicleDetail';
import Notifications from './pages/Notifications';
import VideoPlayback from './pages/VideoPlayback';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/vehicle/:id" component={VehicleDetail} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/video" component={VideoPlayback} />
      </Switch>
    </Router>
  );
}

export default App;

