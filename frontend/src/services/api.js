const API_URL = "http://localhost:5000/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getCourse(courseId) {
  return request(`/courses/${courseId}`);
}

export function getLearnerProgress(learnerId) {
  return request(`/learners/${learnerId}/progress`);
}

export function completeLesson(lessonId, learnerId) {
  return request(`/lessons/${lessonId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      learnerId,
    }),
  });
}

export function enrollLearner(learnerId, courseId) {
  return request("/enroll", {
    method: "POST",
    body: JSON.stringify({
      learnerId,
      courseId,
    }),
  });
}
