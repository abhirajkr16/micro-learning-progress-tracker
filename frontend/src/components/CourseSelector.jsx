import "./CourseSelector.css";

function CourseSelector({
  courseId,
  enrolledCourseIds,
  onCourseChange,
}) {
  const courseIds = [1, 2, 3, 4];

  return (
    <section className="course-selector">
      <p className="section-label">COURSES</p>

      <div className="course-buttons">
        {courseIds.map((id) => {
          const isEnrolled = enrolledCourseIds.includes(id);
          const isSelected = id === courseId;

          return (
            <button
              key={id}
              className={`
                ${isEnrolled ? "enrolled" : "not-enrolled"}
                ${isSelected ? "selected" : ""}
              `}
              onClick={() => onCourseChange(id)}
            >
              Course {id}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CourseSelector;