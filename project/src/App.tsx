import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CourseManagement } from './components/courses/CourseManagement';
import { AssessmentSystem } from './components/assessments/AssessmentSystem';
import { SimulationHub } from './components/simulations/SimulationHub';
import { PulseCheckSimulation } from './components/simulations/PulseCheckSimulation';
import { ProgressTracking } from './components/progress/ProgressTracking';
import { UserManagement } from './components/admin/UserManagement';
import { Navigation } from './components/layout/Navigation';
import { NotificationSystem } from './components/notifications/NotificationSystem';
import { User, Course, Assessment, SimulationResult } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>
  >([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Administrator',
          role: 'admin', // Hardcode for now; later, fetch from Firestore
          createdAt: new Date(),
        };
        setCurrentUser(appUser);
        setCurrentPage('dashboard');
      } else {
        setCurrentUser(null);
        setCurrentPage('login');
      }
    });

    // Demo data for courses, assessments, etc. (replace with Firestore later)
    const demoCourses: Course[] = [
      {
        id: '1',
        title: 'Fundamentals of Nursing',
        description: 'Introduction to basic nursing principles and practices',
        instructorId: 'instructor1',
        instructorName: 'Dr. Emily Rodriguez',
        modules: [
          {
            id: '1',
            title: 'Patient Care Basics',
            content: 'Essential skills for patient care including vital signs, hygiene, and safety protocols.',
            materials: [
              { id: '1', title: 'Vital Signs Guide', type: 'document', url: '#' },
              { id: '2', title: 'Hygiene Protocols', type: 'video', url: '#' },
            ],
          },
        ],
        createdAt: new Date(),
        enrolledStudents: ['1'],
      },
    ];
    setCourses(demoCourses);

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setNotifications((prev) => [
      ...prev,
      { id: Math.random().toString(), message, type },
    ]);
  };

  const handleSimulationComplete = (result: SimulationResult) => {
    setSimulationResults((prev) => [...prev, result]);
    addNotification(`Simulation completed with score: ${result.score}%`, result.score >= 70 ? 'success' : 'warning');
  };

  const handleLogout = () => {
    auth.signOut();
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const renderCurrentPage = () => {
    if (!currentUser) {
      return <LoginPage onLogin={setCurrentUser} />;
    }

    switch (currentPage) {
      case 'courses':
        return (
          <CourseManagement
            user={currentUser}
            courses={courses}
            setCourses={setCourses}
            onNavigate={setCurrentPage}
          />
        );
      case 'assessments':
        return (
          <AssessmentSystem
            user={currentUser}
            assessments={assessments}
            courses={courses}
            setAssessments={setAssessments}
            onComplete={(score) => addNotification(`Assessment completed with score: ${score}%`, score >= 70 ? 'success' : 'warning')}
          />
        );
      case 'simulations':
        return <SimulationHub user={currentUser} onNavigate={setCurrentPage} />;
      case 'pulse-simulation':
        return (
          <PulseCheckSimulation
            user={currentUser}
            onComplete={handleSimulationComplete}
            onBack={() => setCurrentPage('simulations')}
          />
        );
      case 'progress':
        return (
          <ProgressTracking
            user={currentUser}
            courses={courses}
            assessments={assessments}
            simulationResults={simulationResults}
          />
        );
      case 'users':
        return currentUser.role === 'admin' ? (
          <UserManagement onNavigate={setCurrentPage} />
        ) : (
          <Dashboard
            user={currentUser}
            courses={courses}
            assessments={assessments}
            simulationResults={simulationResults}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return (
          <Dashboard
            user={currentUser}
            courses={courses}
            assessments={assessments}
            simulationResults={simulationResults}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && (
        <Navigation
          user={currentUser}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      <main className="pt-16">{renderCurrentPage()}</main>
      <NotificationSystem notifications={notifications} />
    </div>
  );
}

export default App;