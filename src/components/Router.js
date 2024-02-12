import {BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Home from '../pages/Home'
import Browse from '../pages/Browse'
import Footer from '../components/Footer'
export default function Router() {

    const Layout = () => {
        return (
          <div>
            <Header />
            <Outlet />
            <Footer />
          </div>
        );
      }

      const BrowserRoutes = () => {
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
          </Route>
        </Routes>
      </BrowserRouter>
      }

  return (
    <>
    <Layout/>
    <BrowserRoutes/>
    </>
  );
}