import { useEffect, useState } from "react";

import {
  completeLesson,
  getCourse,
  getLearnerProgress,
} from "./services/api";

import LearnerSelector from "./components/LearnerSelector";
import CourseSelector from "./components/CourseSelector";
import ProgressCard from "./components/ProgressCard";
import LessonList from "./components/LessonList";

import "./App.css";

function App() {
  const [learnerId, setLearnerId] = useState(() => {
    const savedLearnerId = localStorage.getItem("learnerId");
    return savedLearnerId ? Number(savedLearnerId) : 1;
  });

  const [courseId, setCourseId] = useState(1);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);

  const [completingLesson, setCompletingLesson] = useState(null);
  const [error, setError] = useState("");

  async function loadData(isCourseChange = false) {
    try {
      if (isCourseChange) {
        setCourseLoading(true);
      } else {
        setLoading(true);
      }
  
      setError("");
  
      const [courseResponse, progressResponse] = await Promise.all([
        getCourse(courseId, learnerId),
        getLearnerProgress(learnerId),
      ]);
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      setCourse(courseResponse.data);
      setProgress(progressResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      if (isCourseChange) {
        setCourseLoading(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadData(false);
  }, [learnerId]);

  useEffect(() => {
    if (!loading) {
      loadData(true);
    }
  }, [courseId]);

  function handleLearnerChange(newLearnerId) {
    localStorage.setItem("learnerId", newLearnerId);

    setLearnerId(newLearnerId);
    setCourseId(1);
  }

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

  const enrolledCourseIds =
    progress?.courses?.map((course) => course.id) || [];

  if (loading) {
    return (
      <main className="app">
        <div className="status-card">
          <p>Loading learner data...</p>
        </div>
      </main>
    );
  }

  if (error && !course) {
    return (
      <main className="app">
        <div className="status-card">
          <h2>Unable to load data</h2>
          <p>{error}</p>
          <button onClick={() => loadData(false)}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <div className="app-container">
        <LearnerSelector
          learnerId={learnerId}
          learner={progress?.learner}
          onLearnerChange={handleLearnerChange}
        />

        <CourseSelector
          courseId={courseId}
          enrolledCourseIds={enrolledCourseIds}
          onCourseChange={setCourseId}
        />

        <div className={`course-content ${courseLoading ? "loading" : ""}`}>
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

          {!selectedCourseProgress && (
            <div className="not-enrolled-message">
              You are not enrolled in this course.
            </div>
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
      </div>
    </main>
  );
}

export default App;