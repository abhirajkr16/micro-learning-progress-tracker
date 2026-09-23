import { useEffect, useState } from "react";

import {
  completeLesson,
  getCourse,
  getLearnerProgress,
} from "./services/api";

import CourseSelector from "./components/CourseSelector";
import ProgressCard from "./components/ProgressCard";
import LessonList from "./components/LessonList";

import "./App.css";

const learnerId = 1;

function App() {
  const [courseId, setCourseId] = useState(1);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingLesson, setCompletingLesson] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [courseResponse, progressResponse] = await Promise.all([
        getCourse(courseId, learnerId),
        getLearnerProgress(learnerId),
      ]);

      setCourse(courseResponse.data);
      setProgress(progressResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [courseId]);

  async function handleComplete(lessonId) {
    try {
      setCompletingLesson(lessonId);
      setError("");

      await completeLesson(lessonId, learnerId);

      setCourse((currentCourse) => ({
        ...currentCourse,
        lessons: currentCourse.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, completed: true }
            : lesson
        ),
      }));

      const progressResponse = await getLearnerProgress(learnerId);
      setProgress(progressResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCompletingLesson(null);
    }
  }

  const selectedCourseProgress = progress?.courses?.find(
    (course) => course.id === courseId
  );

  if (loading) {
    return (
      <main className="app">
        <div className="status-card">
          <p>Loading course...</p>
        </div>
      </main>
    );
  }

  if (error && !course) {
    return (
      <main className="app">
        <div className="status-card">
          <h2>Unable to load course</h2>
          <p>{error}</p>
          <button onClick={loadData}>Try again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <div className="app-container">
        <CourseSelector
          courseId={courseId}
          onCourseChange={setCourseId}
        />

        <header className="app-header">
          <p className="eyebrow">MICRO-LEARNING</p>

          <h1>{course.title}</h1>

          <p className="course-description">
            {course.description}
          </p>
        </header>

        {selectedCourseProgress && (
          <ProgressCard progress={selectedCourseProgress} />
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <LessonList
          lessons={course.lessons}
          onComplete={handleComplete}
          completingLesson={completingLesson}
        />
      </div>
    </main>
  );
}

export default App;