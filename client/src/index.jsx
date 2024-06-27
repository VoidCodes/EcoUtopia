import React from 'react'
import ReactDOM from 'react-dom/client'

import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

// Pages and components
import App from './pages/App.jsx'
import TestPage from './pages/TestPage.jsx';
import Courses from './pages/Courses.jsx';
import ViewCourse from './pages/ViewCourse.jsx';
import ViewRewards from './pages/Rewards.jsx';
import Login from './pages/Login.jsx'
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Orders from './pages/Orders';
import EditOrders from './pages/admin/EditOrders';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCourses from './pages/admin/AdminCourses.jsx';
import CreateCourse from './pages/admin/CreateCourse.jsx';
import EditCourse from './pages/admin/EditCourse.jsx';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, createTheme, rem } from '@mantine/core'

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
      {/*<Box padding="xl" style={{marginTop: '70px'}} /> */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<ViewCourse />} />
        <Route path="/rewards" element={<ViewRewards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/editorders/:orderId" element={<EditOrders/>} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/view-courses" element={<AdminCourses />} />
        <Route path="/admin/create-course" element={<CreateCourse />} />
        <Route path="/admin/edit-course/:courseId" element={<EditCourse />} />
      </Routes>
    </>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <GoogleReCaptchaProvider reCaptchaKey = {import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
        <AuthProvider>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </AuthProvider>
      </GoogleReCaptchaProvider>
    </MantineProvider>
  </React.StrictMode>
)