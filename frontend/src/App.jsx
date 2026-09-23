import { useEffect, useState } from "react";
import { getCourse, getLearnerProgress } from "./services/api";
import ProgressCard from "./components/ProgressCard";
import "./App.css";

const learnerId = 1;
const courseId = 1;

function App() {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [courseResponse, progressResponse] = await Promise.all([
        getCourse(courseId),
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
  }, []);

  if (loading) {
    return (
      <main className="app">
        <div className="status-card">
          <p>Loading course...</p>
        </div>
      </main>
    );
  }

  if (error) {
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
        <header className="app-header">
          <p className="eyebrow">MICRO-LEARNING</p>
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
        </header>

        <ProgressCard progress={progress} />

        <section className="lessons-section">
          <div className="section-heading">
            <p className="section-label">CURRICULUM</p>
            <h2>Course Lessons</h2>
          </div>

          <div className="lesson-list">
            {course.lessons.map((lesson, index) => (
              <article className="lesson-card" key={lesson.id}>
                <span className="lesson-number">{index + 1}</span>

                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p>{lesson.contentOrUrl}</p>
                </div>

                <span className="lesson-status">
                  {lesson.completed ? "Completed" : "Pending"}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;