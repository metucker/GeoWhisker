import {BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './Header'
import Home from '../pages/Home'
import Browse from '../pages/Browse'
import SignUp from '../pages/SignUp'
import Cats from '../pages/Cats'
import AddCat from '../pages/AddCat'
import LogIn from '../pages/LogIn'
import Footer from './Footer'
import CatProfile from '../pages/CatProfile'; // Assuming you have a component for listing cats
import User from '../pages/User'; // Assuming you have a component for listing cats
import UserProfile from '../pages/UserProfile'; // Assuming you have a component for listing users
import Resources from '../pages/Resources'; // Assuming you have a component for listing cats
import LogOut from '../pages/LogOut'; // Assuming you have a component for listing cats

export default function Router() {

    const Layout = () => {
        return (
          <>
            <Header />
            <Outlet />
            <Footer />
          </>
        );
      }

      const BrowserRoutes = () => {
        return (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/cats" element={<Cats />}>
              <Route path=":catID" element={<CatProfile />} />
            </Route> */}
            <Route path="/cats" element={<Cats />}/>
            <Route path="/cats/:catID" element={<CatProfile />}/>
            <Route path="/browse" element={<Browse />} />
            <Route path="/addcat" element={<AddCat />} />
            <Route path="/user" element={<User/>} />
            <Route path="/user/:userID" element={<UserProfile/>} />
            <Route path="/resources" element={<Resources/>} />
            <Route path="/logout" element={<LogOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
        );
      }

  return (
    <>
    <BrowserRoutes/>
    </>
  );
}