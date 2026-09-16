import api from './api';
import {
  MockCourse,
  getStoredCourses,
  getStoredEnrollments,
  saveEnrollments
} from './mockData';
import { useAuthStore } from '../stores/authStore';

export interface Course extends MockCourse {}
export interface EnrollmentItem {
  enrollmentId: number;
  courseId: number;
  course: {
    id: number;
    title: string;
    thumbnailUrl?: string;
    durationHours: number;
    category: string;
    instructor?: string;
  };
  status: 'enrolled' | 'completed' | 'cancelled';
  progress: number;
  completedModules?: number[];
  enrollmentDate: string;
  completedAt?: string | null;
}

export interface CourseListResponse {
  success: boolean;
  data: {
    courses: Course[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export const coursesService = {
  async getCourses(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<CourseListResponse> {
    try {
      const response = await api.get('/courses', { params });
      return response.data;
    } catch {
      // Fallback
      let allCourses = getStoredCourses();
      if (params?.category && params.category !== 'all' && params.category !== 'Todos') {
        allCourses = allCourses.filter(
          (c) => c.category.toLowerCase() === params.category?.toLowerCase()
        );
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        allCourses = allCourses.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.instructor.toLowerCase().includes(query)
        );
      }

      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const totalItems = allCourses.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const offset = (page - 1) * limit;
      const paginated = allCourses.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          courses: paginated,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit
          }
        }
      };
    }
  },

  async getCourseById(id: number): Promise<{ success: boolean; data: Course }> {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch {
      const allCourses = getStoredCourses();
      const found = allCourses.find((c) => c.id === Number(id));
      if (!found) {
        throw new Error('Curso no encontrado');
      }
      return {
        success: true,
        data: found
      };
    }
  },

  async enrollInCourse(courseId: number): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      const currentEnrollments = getStoredEnrollments(userId);
      const allCourses = getStoredCourses();
      const course = allCourses.find((c) => c.id === Number(courseId));

      if (!course) {
        throw new Error('Curso no encontrado');
      }

      const existing = currentEnrollments.find(
        (e) => e.courseId === Number(courseId) || e.course?.id === Number(courseId)
      );
      if (existing) {
        return {
          success: true,
          data: existing,
          message: 'Ya estás inscrito en este curso'
        };
      }

      const newEnrollment: EnrollmentItem = {
        enrollmentId: Math.floor(1000 + Math.random() * 9000),
        courseId: Number(courseId),
        course: {
          id: course.id,
          title: course.title,
          thumbnailUrl: course.thumbnailUrl,
          durationHours: course.durationHours,
          category: course.category,
          instructor: course.instructor
        },
        status: 'enrolled',
        progress: 0,
        completedModules: [],
        enrollmentDate: new Date().toISOString(),
        completedAt: null
      };

      currentEnrollments.unshift(newEnrollment);
      saveEnrollments(userId, currentEnrollments);

      return {
        success: true,
        data: newEnrollment,
        message: 'Inscripción exitosa al curso'
      };
    }
  },

  async getMyEnrollments(status?: string): Promise<{
    success: boolean;
    data: { enrollments: EnrollmentItem[] };
  }> {
    try {
      const response = await api.get('/courses/me/enrollments', { params: { status } });
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      let enrollments = getStoredEnrollments(userId);

      if (status && status !== 'all') {
        enrollments = enrollments.filter((e) => e.status === status);
      }

      return {
        success: true,
        data: {
          enrollments
        }
      };
    }
  },

  async updateProgress(
    enrollmentId: number,
    progress: number,
    completedModuleId?: number
  ): Promise<{ success: boolean; data: any; message: string }> {
    try {
      const response = await api.put(`/courses/enrollments/${enrollmentId}/progress`, {
        progress
      });
      return response.data;
    } catch {
      const user = useAuthStore.getState().user;
      const userId = user?.id || 1;
      const enrollments = getStoredEnrollments(userId);
      const index = enrollments.findIndex((e) => e.enrollmentId === Number(enrollmentId));

      if (index !== -1) {
        const item = enrollments[index];
        item.progress = Math.min(100, Math.max(0, progress));
        if (completedModuleId) {
          item.completedModules = Array.from(
            new Set([...(item.completedModules || []), completedModuleId])
          );
        }
        if (item.progress >= 100) {
          item.status = 'completed';
          item.completedAt = new Date().toISOString();
        }
        enrollments[index] = item;
        saveEnrollments(userId, enrollments);
      }

      return {
        success: true,
        data: enrollments[index],
        message: 'Progreso actualizado exitosamente'
      };
    }
  }
};
