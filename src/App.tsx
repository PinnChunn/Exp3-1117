import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import EventCard from './components/EventCard';
import EventDetail from './components/EventDetail';
import AuthModal from './components/AuthModal';
import SkillPaths from './components/SkillPaths';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import { getCurrentUser } from './lib/auth';

const FEATURED_EVENTS = [
  {
    id: 'ai-ux-workshop',
    title: "AI-Powered UX Design Workshop",
    date: "March 15, 2024",
    time: "10:00 AM - 4:00 PM EST",
    tags: ["AI", "UX", "Design"],
    skills: ["AI Integration", "UX Research", "Interface Design", "Technical Implementation"],
    description: "Join us for an intensive workshop that bridges the gap between AI technology and UX design. Learn how to leverage artificial intelligence to enhance user experiences, automate design workflows, and create more intelligent interfaces.",
    imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    requiresAuth: true,
    price: 100,
    xp: 500
  },
  {
    id: 'ux-3toryu',
    title: "UX.3toryu Workshop",
    date: "September 2, 2024",
    time: "18:00 UTC",
    tags: ["UX", "Web3", "Design"],
    skills: ["Web3 Design", "DApp UX", "Token Economics", "Smart Contract Integration"],
    description: "An immersive workshop exploring the future of Web3 user experiences. Learn how to design intuitive interfaces for decentralized applications from industry experts.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    externalLink: "https://lu.ma/ux3",
    requiresAuth: false
  }
];

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname]);

  return null;
}

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingEventIndex, setPendingEventIndex] = useState<number | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  const handleEventRegistration = (index: number) => {
    const event = FEATURED_EVENTS[index];
    
    if (event.externalLink) {
      window.open(event.externalLink, '_blank', 'noopener,noreferrer');
      return;
    }

    if (event.requiresAuth && !isAuthenticated) {
      setPendingEventIndex(index);
      setIsAuthModalOpen(true);
      return;
    }

    if (event.price && !registeredEvents.includes(index)) {
      setPendingEventIndex(index);
      setIsPaymentModalOpen(true);
      return;
    }

    if (event.meetingLink && registeredEvents.includes(index)) {
      window.open(event.meetingLink, '_blank');
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    
    if (pendingEventIndex !== null) {
      handleEventRegistration(pendingEventIndex);
    }
  };

  const handlePaymentSuccess = () => {
    if (pendingEventIndex !== null) {
      setRegisteredEvents(prev => [...prev, pendingEventIndex]);
      setIsPaymentModalOpen(false);
      setPendingEventIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              EXP3
            </Link>
            <UserProfile 
              isAuthenticated={isAuthenticated}
              onLogin={() => setIsAuthModalOpen(true)}
              onLogout={() => {
                setIsAuthenticated(false);
                setUser(null);
              }}
            />
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <main className="pt-16">
            <Hero />
            <Benefits />

            <section id="events" className="py-20">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Featured Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {FEATURED_EVENTS.map((event, index) => (
                    <EventCard
                      key={index}
                      {...event}
                      onRegister={() => handleEventRegistration(index)}
                      isAuthenticated={isAuthenticated}
                      isRegistered={registeredEvents.includes(index)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <SkillPaths />
          </main>
        } />
        
        <Route path="/events/:id" element={<EventDetail />} />
      </Routes>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingEventIndex(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {pendingEventIndex !== null && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPendingEventIndex(null);
          }}
          onSuccess={handlePaymentSuccess}
          price={FEATURED_EVENTS[pendingEventIndex].price || 0}
          title={FEATURED_EVENTS[pendingEventIndex].title}
        />
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}