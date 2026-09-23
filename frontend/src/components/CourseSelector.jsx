import "./CourseSelector.css";

function CourseSelector({ courseId, onCourseChange }) {
  const courseIds = [1, 2, 3, 4];

  return (
    <section className="course-selector">
      <p className="section-label">COURSES</p>

      <div className="course-buttons">
        {courseIds.map((id) => (
          <button
            key={id}
            className={id === courseId ? "active" : ""}
            onClick={() => onCourseChange(id)}
          >
            Course {id}
          </button>
        ))}
      </div>
    </section>
  );
}

export default CourseSelector;