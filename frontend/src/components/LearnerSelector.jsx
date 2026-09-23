import "./LearnerSelector.css";

const learners = [
  {
    id: 1,
    name: "Abhiraj Kumar",
  },
  {
    id: 2,
    name: "Rahul Sharma",
  },
];

function LearnerSelector({ learnerId, learner, onLearnerChange }) {
  return (
    <section className="learner-selector">
      <div className="learner-profile">
        <p className="section-label">LEARNER</p>

        <h2>{learner?.name || "Loading..."}</h2>

        {learner?.email && (
          <p className="learner-email">{learner.email}</p>
        )}
      </div>

      <select
  id="learner-select"
  name="learner"
  value={learnerId}
  onChange={(event) =>
    onLearnerChange(Number(event.target.value))
  }
>
        {learners.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </section>
  );
}

export default LearnerSelector;