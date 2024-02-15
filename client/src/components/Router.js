import {BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './Header'
import Home from '../pages/Home'
import Browse from '../pages/Browse'
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
            <Route path="/home" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
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