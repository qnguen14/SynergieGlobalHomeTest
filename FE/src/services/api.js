const API_BASE_URL = '/api/lesson';

export const api = {
  // Fetch lessons (defaults to today on backend if date parameter is empty)
  async getLessons(date = '') {
    const url = date ? `${API_BASE_URL}?date=${encodeURIComponent(date)}` : API_BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch lessons (${response.status})`);
    }
    return await response.json();
  },

  // Fetch ALL lessons across all dates without date filtering
  async getAllLessons() {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
      throw new Error(`Failed to fetch all lessons (${response.status})`);
    }
    return await response.json();
  },

  // Get lesson details by ID
  async getLessonById(id) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson details (${response.status})`);
    }
    return await response.json();
  },

  // Create a new lesson
  async createLesson(lessonData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create lesson (${response.status})`);
    }
    return await response.json();
  },

  // Update an existing lesson
  async updateLesson(id, lessonData) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update lesson (${response.status})`);
    }
    return await response.json();
  },

  // Cancel a lesson with notes
  async cancelLesson(id, notes) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to cancel lesson (${response.status})`);
    }
    return await response.json();
  },

  // Toggle IsExam status
  async toggleExam(id) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}/toggle-exam`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to toggle exam status (${response.status})`);
    }
    return await response.json();
  },
};
