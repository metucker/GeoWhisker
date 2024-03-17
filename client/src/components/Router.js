import {BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './Header'
import Home from '../pages/Home'
import Browse from '../pages/Browse'
import SignUp from '../pages/SignUp'
import Cats from '../pages/Cats'
import AddCat from '../pages/AddCat'
import LogIn from '../pages/LogIn'
import Footer from './Footer'
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
            <Route path="/cats" element={<Cats />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/addcat" element={<AddCat />} />
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