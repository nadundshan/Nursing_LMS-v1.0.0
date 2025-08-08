import React, { useState } from 'react';
import { LogIn, Stethoscope, Mail, Lock, User, Shield, GraduationCap } from 'lucide-react';
import { User as UserType } from '../../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'instructor' | 'admin'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login - in real app, this would authenticate with Firebase
    const demoUsers = {
      student: {
        id: '1',
        email: 'student@nursing.edu',
        name: 'Sarah Johnson',
        role: 'student' as const,
        createdAt: new Date(),
        enrolledCourses: ['1', '2']
      },
      instructor: {
        id: '2',
        email: 'instructor@nursing.edu',
        name: 'Dr. Emily Rodriguez',
        role: 'instructor' as const,
        createdAt: new Date(),
        assignedCourses: ['1', '2']
      },
      admin: {
        id: '3',
        email: 'admin@nursing.edu',
        name: 'Administrator',
        role: 'admin' as const,
        createdAt: new Date()
      }
    };

    onLogin(demoUsers[selectedRole]);
  };

  const roleOptions = [
    { value: 'student', label: 'Student', icon: GraduationCap, color: 'bg-blue-500' },
    { value: 'instructor', label: 'Instructor', icon: User, color: 'bg-teal-500' },
    { value: 'admin', label: 'Administrator', icon: Shield, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Nursing School LMS</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedRole === role.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{role.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-medium">Demo Login:</p>
            <p className="text-xs text-gray-500">
              Select any role above and use any email/password to demo the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};