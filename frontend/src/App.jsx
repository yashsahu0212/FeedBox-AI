import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import MyReportsView from './components/MyReportsView';
import ReportProblemView from './components/ReportProblemView';
import ToastNotification from './components/ToastNotification';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/LoginPage';
import { initialTickets, nearbyActivity } from './data/mockData';
import {
  getCurrentUserSession,
  getCurrentAdminSession,
  logoutUserSession,
  submitNewReport,
  getLocalReports
} from './lib/supabase';

function AppContent() {
  // Navigation state
  const [currentPath, setCurrentPath] = useState('student-home');
  const [selectedTicketId, setSelectedTicketId] = useState('TICK-8842');
  const [toastMessage, setToastMessage] = useState('');

  // User session state (Student or Admin)
  const [authUser, setAuthUser] = useState(() => getCurrentUserSession());
  const [adminUser, setAdminUser] = useState(() => getCurrentAdminSession());

  // Persistent Tickets State
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('campusai_tickets');
      return saved ? JSON.parse(saved) : initialTickets;
    } catch {
      return initialTickets;
    }
  });

  // Save to localStorage when tickets state updates
  useEffect(() => {
    try {
      localStorage.setItem('campusai_tickets', JSON.stringify(tickets));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  }, [tickets]);

  // Handle Logout
  const handleLogout = () => {
    logoutUserSession();
    setAuthUser(null);
    setAdminUser(null);
  };

  // Handler: Add new ticket (Student Submission)
  const handleCreateReport = (newTicketData) => {
    // Submit to Supabase / DB adapter
    submitNewReport(newTicketData);

    const newId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      title: newTicketData.title,
      description: newTicketData.description,
      category: newTicketData.category || 'Issue',
      department: newTicketData.department || 'Facilities & Maintenance',
      status: 'Submitted',
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedTime: 'Just now',
      location: newTicketData.location,
      attachedPhoto: newTicketData.attachedPhoto || null,
      timeline: [
        { status: 'Submitted', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Ticket dispatched via portal', done: true },
        { status: `Assigned to ${newTicketData.department || 'Facilities'}`, time: 'Pending', note: 'Queued for department triage', active: true },
        { status: 'In Progress', time: 'Queued', note: 'Technician assignment pending', done: false },
        { status: 'Resolved', time: 'Pending', note: 'Resolution awaiting confirmation', done: false }
      ],
      comments: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newId);
    setToastMessage(`Report #${newId} created & dispatched to ${newTicketData.department}!`);
    return newTicket;
  };

  // Handler: Add comment to a ticket
  const handleAddComment = (ticketId, commentText) => {
    const authorName = authUser?.name ? `${authUser.name} (${authUser.role === 'student' ? 'Student' : 'Staff'})` : 'Student';
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const updatedComments = [
            ...(t.comments || []),
            {
              author: authorName,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: commentText
            }
          ];
          return {
            ...t,
            comments: updatedComments,
            updatedTime: 'Just now'
          };
        }
        return t;
      })
    );
    setToastMessage('Comment posted successfully!');
  };

  const activeTicketsCount = tickets.filter(
    t => t.status === 'In Progress' || t.status === 'Submitted'
  ).length;

  // Gatekeeper: If user is not logged in, render unified Student & Admin Login Page
  if (!authUser) {
    return (
      <LoginPage
        onLoginSuccess={(userSession) => {
          setAuthUser(userSession);
          if (userSession.userType === 'admin' || userSession.role?.includes('admin')) {
            setAdminUser(userSession);
            setCurrentPath('admin-portal');
          } else {
            setCurrentPath('student-home');
          }
        }}
      />
    );
  }

  // Active Admin object for Admin Portal
  const activeAdminObj = adminUser || (authUser?.userType === 'admin' || authUser?.role?.includes('admin') ? authUser : null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f8] text-[#1c1b1c] font-geist antialiased selection:bg-[#e2dfe1]">
      
      {/* Responsive Fixed Header */}
      <Header
        currentPath={currentPath}
        navigateTo={setCurrentPath}
        activeTicketsCount={activeTicketsCount}
        authUser={authUser}
        onLogout={handleLogout}
      />

      {/* Main Content View Container */}
      <main className="flex-1 pt-14 pb-12 w-full">
        {currentPath === 'student-home' && (
          <HomeView
            tickets={tickets}
            navigateTo={setCurrentPath}
            selectTicket={(id) => setSelectedTicketId(id)}
          />
        )}

        {currentPath === 'my-reports' && (
          <MyReportsView
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={(id) => setSelectedTicketId(id)}
            onAddComment={handleAddComment}
            navigateTo={setCurrentPath}
          />
        )}

        {currentPath === 'report-a-problem' && (
          <ReportProblemView
            onSubmitReport={handleCreateReport}
            nearbyActivity={nearbyActivity}
          />
        )}

        {currentPath === 'admin-portal' && (
          activeAdminObj ? (
            <AdminDashboard
              adminUser={activeAdminObj}
              onLogout={handleLogout}
              onSwitchAdmin={(profile) => {
                setAdminUser(profile);
                setAuthUser(profile);
              }}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={(profile) => {
                setAdminUser(profile);
                setAuthUser(profile);
              }}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Rendering Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fdf8f8]">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md w-full flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h2 className="text-lg font-bold text-[#1c1b1c]">Something went wrong</h2>
            <p className="text-xs text-[#77767b]">
              An unexpected UI error occurred. Click below to reload the app cleanly.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1b1b1e] text-white text-xs font-semibold hover:bg-[#313030] transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
