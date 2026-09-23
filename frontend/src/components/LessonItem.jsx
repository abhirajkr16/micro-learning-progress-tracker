import "./LessonItem.css";

function LessonItem({ lesson, number, onComplete, completingLesson }) {
  const isCompleted = lesson.completed;
  const isSaving = completingLesson === lesson.id;

  return (
    <article className="lesson-card">
      <span className="lesson-number">{number}</span>

      <div className="lesson-info">
        <h3>{lesson.title}</h3>
        <p>{lesson.contentOrUrl}</p>
      </div>

      <button
        className={`lesson-button ${isCompleted ? "completed" : ""}`}
        disabled={isCompleted || isSaving}
        onClick={() => onComplete(lesson.id)}
      >
        {isCompleted
          ? "Completed"
          : isSaving
            ? "Saving..."
            : "Complete"}
      </button>
    </article>
  );
}

export default LessonItem;