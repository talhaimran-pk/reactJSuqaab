import { useEffect } from 'react';
import { Routes, Route, Navigate , useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from './store/authStore';
import { useCurrentUser } from './hooks/useAuth';


import SplashScreen from './pages/SplashScreen.jsx';
import ClimbingCalibration from './pages/ClimbingCalibration';
import EditClimbingCalibration from './pages/EditClimbingCalibration';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Welcome from './pages/Welcome.jsx';
import PropertyList from './pages/PropertyList.jsx';
import AddProperty from './pages/AddProperty.jsx';
import PropertyDashboard from './pages/PropertyDashboard.jsx';
import PropertySettings from './pages/PropertySettings.jsx';
import EditProperty from './pages/EditProperty.jsx';
import CameraManagement from './pages/CameraManagement.jsx';
import AddCamera from './pages/AddCamera.jsx';
import EditCamera from './pages/EditCamera.jsx';
import LiveCamera from './pages/LiveCamera.jsx';
import LiveDrone from  './pages/LiveDrone.jsx';
import DroneManagement from './pages/DroneManagement.jsx';
import AddDrone from './pages/AddDrone.jsx';
import EditDrone from './pages/EditDrone.jsx';
import DroneControl from './pages/DroneControl.jsx';
import Alerts from './pages/Alerts.jsx';
import AlertDetail from './pages/AlertDetail.jsx';
import AuthorizedPeople from './pages/AuthorizedPeople.jsx';
import AddPerson from './pages/AddPerson.jsx';
import EditPerson from './pages/EditPerson.jsx';
import FlightLogs from './pages/FlightLogs.jsx';
import GridView from './pages/GridView.jsx';
import FullMap from './pages/FullMap.jsx';
import FenceCellEditor from './pages/FenceCellEditor';
import EditFenceCells from './pages/Editfencecells';
// 1. Add this import at the top with other imports
import { useAlertNotifications } from './hooks/useAlertNotifications';
import { useQueryClient } from '@tanstack/react-query';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const { isAuthenticated } = useAuthStore();

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/properties" replace />;
  }

  return children;
};

function App() {
//   useCurrentUser();

 

//   const token = localStorage.getItem('token');
//   const queryClient = useQueryClient();

//   // Get propertyId from URL if we're on a property page
//   const match = window.location.pathname.match(/\/property\/(\d+)/);
//   const propertyId = match ? parseInt(match[1]) : null;

//   // Request desktop notification permission once on load
// useEffect(() => {
//   if ('Notification' in window && Notification.permission === 'default') {
//     Notification.requestPermission();
//   }
// }, []);

//   useAlertNotifications({
//     propertyId,
//     token,
//     onNewAlert: () => {
//       // Automatically refresh alerts list when new alert arrives
//       queryClient.invalidateQueries({ queryKey: ['alerts'] });
//     },
//   });

 
useCurrentUser();
 
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();
  const navigate = useNavigate();   // ← add this
 
  const match = window.location.pathname.match(/\/property\/(\d+)/);
  const propertyId = match ? parseInt(match[1]) : null;
 
  // Request desktop notification permission once on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
 
  useAlertNotifications({
    propertyId,
    token,
    onNewAlert: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    // ← NEW: called when toast OR desktop notification is clicked
    onNotificationClick: ({ propertyId: pid, alertId }) => {
      navigate(`/property/${pid}/alert/${alertId}`);
    },
  });
 
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<SplashScreen />} />
      
       <Route
     path="/property/:id/camera/:cameraId/cells"
     element={<FenceCellEditor />}
     />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertyList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        {/* Property */}
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/settings"
          element={
            <ProtectedRoute>
              <PropertySettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/edit"
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          }
        />

      


<Route path="/property/:id/camera/:cameraId/edit-cells" element={<EditFenceCells />} />

        {/* Camera Routes */}
        <Route
          path="/property/:id/cameras"
          element={
            <ProtectedRoute>
              <CameraManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/camera/add"
          element={
            <ProtectedRoute>
              <AddCamera />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/camera/:cameraId/edit"
          element={
            <ProtectedRoute>
              <EditCamera />
            </ProtectedRoute>
          }
        />

        {/* Calibration */}
        <Route
          path="/property/:id/camera/:cameraId/calibrate/new"
          element={
            <ProtectedRoute>
              <ClimbingCalibration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/camera/:cameraId/calibrate"
          element={
            <ProtectedRoute>
              <EditClimbingCalibration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/camera/:cameraId/climbing"
          element={
            <ProtectedRoute>
              <ClimbingCalibration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/camera/:cameraId"
          element={
            <ProtectedRoute>
              <LiveCamera />
            </ProtectedRoute>
          }
        />

        {/* Drone Routes */}
        <Route
          path="/property/:id/drones"
          element={
            <ProtectedRoute>
              <DroneManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/drone/add"
          element={
            <ProtectedRoute>
              <AddDrone />
            </ProtectedRoute>
          }
        />
         
         <Route path="/property/:id/drone/:droneId/live" element={<LiveDrone />} />
        <Route
          path="/property/:id/drone/:droneId/edit"
          element={
            <ProtectedRoute>
              <EditDrone />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/drone-control"
          element={
            <ProtectedRoute>
              <DroneControl />
            </ProtectedRoute>
          }
        />

        {/* Alert Routes */}
        <Route
          path="/property/:id/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/alert/:alertId"
          element={
            <ProtectedRoute>
              <AlertDetail />
            </ProtectedRoute>
          }
        />

        {/* People Routes */}
        <Route
          path="/property/:id/people"
          element={
            <ProtectedRoute>
              <AuthorizedPeople />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/person/add"
          element={
            <ProtectedRoute>
              <AddPerson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/person/:personId/edit"
          element={
            <ProtectedRoute>
              <EditPerson />
            </ProtectedRoute>
          }
        />

        {/* Other */}
        <Route
          path="/property/:id/logs"
          element={
            <ProtectedRoute>
              <FlightLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/grid"
          element={
            <ProtectedRoute>
              <GridView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property/:id/map"
          element={
            <ProtectedRoute>
              <FullMap />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={10000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;

