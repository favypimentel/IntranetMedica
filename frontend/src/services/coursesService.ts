import api from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  durationHours: number;
  instructor?: string;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Enrollment {
  enrollmentId: number;
  course: {
    id: number;
    title: string;
    thumbnailUrl?: string;
    durationHours: number;
    category: string;
  };
  status: string;
  progress: number;
  enrollmentDate: string;
  completedAt?: string;
}

export const coursesService = {
  async getCourses(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  async getCourseById(id: number) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async enrollInCourse(courseId: number) {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  async getMyEnrollments(status?: string) {
    const response = await api.get('/courses/me/enrollments', {
      params: { status }
    });
    return response.data;
  },

  async updateProgress(enrollmentId: number, progress: number) {
    const response = await api.put(`/courses/enrollments/${enrollmentId}/progress`, {
      progress
    });
    return response.data;
  }
};
