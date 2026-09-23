import "./ProgressCard.css";

function ProgressCard({ progress }) {
  return (
    <section className="progress-card">
      <div className="progress-card-header">
        <div>
          <p className="section-label">YOUR PROGRESS</p>
          <h2>
            {progress.completedLessons} of {progress.totalLessons} lessons
          </h2>
        </div>

        <span className="progress-percentage">
          {progress.progressPercentage}%
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress.progressPercentage}%` }}
        />
      </div>
    </section>
  );
}

export default ProgressCard;