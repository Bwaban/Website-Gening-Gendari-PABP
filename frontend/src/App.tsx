import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import ETicketPage from './pages/ETicketPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import KontakPage from './pages/KontakPage'
import TentangPage from './pages/TentangPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RiwayatTiketPage from './pages/RiwayatTiketPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilPage from './pages/ProfilPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminEventFormPage from './pages/admin/AdminEventFormPage'
import AdminTicketsPage from './pages/admin/AdminTicketsPage'

function SiteLayout() {
  return (
    <div className="min-h-screen bg-cream text-dark">
      <Navbar />
      <main className="min-h-[calc(100vh-8rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pembayaran"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tiket"
          element={
            <ProtectedRoute>
              <ETicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <RiwayatTiketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="events/create" element={<AdminEventFormPage />} />
        <Route path="events/edit/:id" element={<AdminEventFormPage />} />
        <Route path="tickets" element={<AdminTicketsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
