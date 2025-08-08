import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  Star,
  ChevronRight,
  PlayCircle,
  FileText,
  Link
} from 'lucide-react';
import { User, Course } from '../../types';

interface CourseManagementProps {
  user: User;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  onNavigate: (page: string) => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  user,
  courses,
  setCourses,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userCourses = user.role === 'student' 
    ? filteredCourses.filter(course => user.enrolledCourses?.includes(course.id))
    : user.role === 'instructor'
    ? filteredCourses.filter(course => course.instructorId === user.id)
    : filteredCourses;

  const availableCourses = user.role === 'student'
    ? filteredCourses.filter(course => !user.enrolledCourses?.includes(course.id))
    : [];

  const handleEnrollCourse = (courseId: string) => {
    // In real app, this would update the database
    console.log(`Enrolling in course ${courseId}`);
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'document': return FileText;
      case 'link': return Link;
      default: return FileText;
    }
  };

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
            >
              ← Back to Courses
            </button>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCourse.title}</h1>
                  <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedCourse.enrolledStudents.length} students
                    </span>
                    <span>Instructor: {selectedCourse.instructorName}</span>
                  </div>
                </div>
                {user.role === 'student' && !user.enrolledCourses?.includes(selectedCourse.id) && (
                  <button 
                    onClick={() => handleEnrollCourse(selectedCourse.id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enroll Now
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Course Modules</h2>
                {selectedCourse.modules.map((module, index) => (
                  <div key={module.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-gray-600 mb-4">{module.content}</p>
                        
                        {module.materials.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Learning Materials</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {module.materials.map((material) => {
                                const Icon = getMaterialIcon(material.type);
                                return (
                                  <div key={material.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <Icon className="w-5 h-5 text-blue-600" />
                                      <div>
                                        <p className="font-medium text-gray-900 text-sm">{material.title}</p>
                                        <p className="text-xs text-gray-500 capitalize">{material.type}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.role === 'student' ? 'My Courses' : 
                 user.role === 'instructor' ? 'Teaching Courses' : 'Course Management'}
              </h1>
              <p className="text-gray-600">
                {user.role === 'student' ? 'Continue your nursing education journey' :
                 user.role === 'instructor' ? 'Manage your courses and content' : 'Oversee all courses in the system'}
              </p>
            </div>
            {(user.role === 'instructor' || user.role === 'admin') && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Course
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Enrolled Courses */}
        {user.role === 'student' && userCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Enrolled</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrolledStudents.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.modules.length} modules
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses (for students) or All Courses (for instructors/admins) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {user.role === 'student' ? 'Available Courses' : 
             user.role === 'instructor' ? 'My Teaching Courses' : 'All Courses'}
          </h2>
          
          {(user.role === 'student' ? availableCourses : userCourses).length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-600">
                {user.role === 'student' ? 'All available courses have been enrolled' : 'No courses found matching your criteria'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(user.role === 'student' ? availableCourses : userCourses).map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Instructor: {course.instructorName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrolledStudents.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.modules.length} modules
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        {user.role === 'student' ? 'Enroll' : 'View'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};