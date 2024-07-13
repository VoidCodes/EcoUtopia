import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Pages and components
import App from './pages/App.jsx';
import TestPage from './pages/TestPage.jsx';
import Courses from './pages/Courses.jsx';
import ViewCourse from './pages/ViewCourse.jsx';
import ViewOrders from './pages/ViewOrder.jsx';
import ViewRewards from './pages/Rewards.jsx';
import Orders from './pages/Orders';
import EditOrders from './pages/admin/EditOrders';
import OrderDetails from './pages/OrderDetails';
import Posts from './pages/Posts.jsx';
import Registration from './pages/Registration.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import ResetPasswordEnterEmail from './pages/ResetPasswordEnterEmail.jsx';
import ResetPasswordEnterCode from './pages/ResetPasswordEnterCode.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PasswordResetSuccess from './pages/ResetPasswordSuccess.jsx';
import AccountManagement from './pages/AccountManagement.jsx';
import AccountActivation from './pages/AccountActivation.jsx'
import AdminOrders from './pages/admin/AdminOrders';
import AdminCourses from './pages/admin/AdminCourses.jsx';
import CreateCourse from './pages/admin/CreateCourse.jsx';
import EditCourse from './pages/admin/EditCourse.jsx';
import AdminRewards from './pages/admin/AdminRewards.jsx';
import EditReward from './pages/admin/EditReward.jsx';
import CreateReward from './pages/admin/CreateReward.jsx';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, createTheme, Box, rem } from '@mantine/core'

const theme = createTheme({
  //primaryColor: 'violet'
  colors: {
    /* Add your custom colors here */
    deepBlue: [
      '#eef3ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc1',
      '#5f7cb8',
      '#5474b4',
      '#44639f',
      '#39588f',
      '#2d4b81',
    ],
  },

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
})

function Main() {
  return (
    <>
      <Box padding="xl" style={{marginTop: '70px'}} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<ViewCourse />} />
        <Route path="/orderdetails/:orderId" element={<ViewOrders />} />
        <Route path="/rewards" element={<ViewRewards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:paramId" element={<Profile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/change-password/:id" element={<ChangePassword />} />
        <Route path="/reset-password-email" element={<ResetPasswordEnterEmail />} />
        <Route path="/reset-password-code" element={<ResetPasswordEnterCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/account-management" element={<AccountManagement/>} />
        <Route path="/account-activation" element={<AccountActivation/>} />
        <Route path="/change-password/:id" element={<ChangePassword />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/editorders/:orderId" element={<EditOrders/>} />
        <Route path="/orderdetails/:orderId" element={<OrderDetails />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/view-courses" element={<AdminCourses />} />
        <Route path="/admin/create-course" element={<CreateCourse />} />
        <Route path="/admin/edit-course/:courseId" element={<EditCourse />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />
        <Route path="/admin/edit-reward/:rewardId" element={<EditReward />} />
        <Route path="/admin/create-reward" element={<CreateReward />} />
      </Routes>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <GoogleReCaptchaProvider reCaptchaKey = {import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
        <AuthProvider>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
)