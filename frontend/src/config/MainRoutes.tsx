import { Routes, Route, Navigate } from 'react-router-dom';
import UserForm from '../Pages/UserForm/UserForm';

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/userFormInput" replace />} />
      
      <Route path="/userFormInput" element={<UserForm />} />
    </Routes>
  );
}

export default MainRoutes;
