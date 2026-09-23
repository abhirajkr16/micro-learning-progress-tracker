import "./LessonList.css";
import LessonItem from "./LessonItem";

function LessonList({ lessons, onComplete, completingLesson }) {
  return (
    <section className="lessons-section">
      <div className="section-heading">
        <p className="section-label">CURRICULUM</p>
        <h2>Course Lessons</h2>
      </div>

      <div className="lesson-list">
      {lessons.map((lesson, index) => (
  <LessonItem
    key={lesson.id}
    lesson={lesson}
    number={index + 1}
    onComplete={onComplete}
    completingLesson={completingLesson}
  />
))}
      </div>
    </section>
  );
}

export default LessonList;