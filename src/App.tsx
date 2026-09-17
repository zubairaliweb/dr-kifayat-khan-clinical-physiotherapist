import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Services } from './components/Services';
import { Skills } from './components/Skills';
import { Videos } from './components/Videos';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

import {
  initialProfile,
  initialEducation,
  initialServices,
  initialSkills,
  initialVideos,
  initialBlogs
} from './data/initialData';
import {
  ClinicProfile,
  EducationItem,
  ServiceItem,
  SkillCategory,
  VideoItem,
  BlogPost
} from './types';

function MainContent() {
  const { setIsLoginModalOpen, setIsAdminOpen, isAuthenticated } = useAuth();

  // State
  const [profile, setProfile] = useState<ClinicProfile>(initialProfile);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  // Appointment Modal
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);

  // Fetch live data from backend
  const fetchLiveData = async () => {
    try {
      const [pRes, eRes, sRes, kRes, vRes, bRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/education'),
        fetch('/api/services'),
        fetch('/api/skills'),
        fetch('/api/videos'),
        fetch('/api/blogs')
      ]);

      if (pRes.ok) setProfile(await pRes.json());
      if (eRes.ok) setEducation(await eRes.json());
      if (sRes.ok) setServices(await sRes.json());
      if (kRes.ok) setSkills(await kRes.json());
      if (vRes.ok) setVideos(await vRes.json());
      if (bRes.ok) setBlogs(await bRes.json());
    } catch (err) {
      console.warn("Using initial static dataset due to API offline/initializing", err);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const handleOpenAppointment = (serviceName?: string) => {
    setSelectedServiceForBooking(serviceName);
    setIsAppointmentOpen(true);
  };

  const handleOpenAdminFromNav = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Navbar */}
      <Navbar
        phone={profile.phone}
        whatsapp={profile.whatsapp}
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenAdmin={handleOpenAdminFromNav}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          profile={profile}
          onOpenAppointment={() => handleOpenAppointment()}
          onExploreServices={() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* About Section */}
        <About
          profile={profile}
          onOpenAppointment={() => handleOpenAppointment()}
        />

        {/* Education Section */}
        <Education education={education} />

        {/* Services Section */}
        <Services
          services={services}
          onBookService={(name) => handleOpenAppointment(name)}
        />

        {/* Skills Section */}
        <Skills categories={skills} />

        {/* Videos Gallery Section */}
        <Videos
          videos={videos}
          onOpenAdminVideos={() => {
            if (isAuthenticated) {
              setIsAdminOpen(true);
            } else {
              setIsLoginModalOpen(true);
            }
          }}
        />

        {/* Blog & Articles Section */}
        <Blog
          blogs={blogs}
          onOpenAdminBlogs={() => {
            if (isAuthenticated) {
              setIsAdminOpen(true);
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          onOpenAppointment={() => handleOpenAppointment()}
        />

        {/* Contact Section */}
        <Contact
          profile={profile}
          prefilledService={selectedServiceForBooking}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenAdmin={handleOpenAdminFromNav}
      />

      {/* Appointment Consultation Modal */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        defaultService={selectedServiceForBooking}
      />

      {/* Admin Authentication Login Modal */}
      <AdminLoginModal />

      {/* Admin Management Dashboard */}
      <AdminDashboard
        onRefreshData={fetchLiveData}
        profile={profile}
        onUpdateProfile={(newProf) => setProfile(newProf)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
