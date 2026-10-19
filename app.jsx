const { useState, useRef } = React;

const startingValues = {
  studyHours: "4",
  attendance: "88",
  previousGpa: "3.22",
  assessment: "80",
  exam: "70",
};

const fields = [
  {
    name: "studyHours",
    label: "Study hours per day",
    hint: "Your daily average",
    min: 0,
    max: 16,
    step: 0.5,
    suffix: "hrs",
    icon: "◷",
  },
  {
    name: "attendance",
    label: "Attendance",
    hint: "Across your current semester",
    min: 0,
    max: 100,
    step: 1,
    suffix: "%",
    icon: "▦",
  },
  {
    name: "previousGpa",
    label: "Previous semester GPA",
    hint: "Your most recent result",
    min: 0,
    max: 4,
    step: 0.01,
    suffix: "/ 4.00",
    icon: "↗",
  },
  {
    name: "assessment",
    label: "Assessment score",
    hint: "Your average assessment score",
    min: 0,
    max: 100,
    step: 1,
    suffix: "%",
    icon: "✓",
  },
  {
    name: "exam",
    label: "Exam score",
    hint: "Expected or recent score",
    min: 0,
    max: 100,
    step: 1,
    suffix: "%",
    icon: "✳",
  },
];

function estimateCgpa(values) {
  const estimate =
    Number(values.previousGpa) * 0.48 +
    (Number(values.assessment) / 100) * 4 * 0.18 +
    (Number(values.exam) / 100) * 4 * 0.24 +
    (Number(values.attendance) / 100) * 4 * 0.06 +
    (Math.min(Number(values.studyHours), 12) / 12) * 4 * 0.04;

  return Math.max(0, Math.min(4, estimate));
}

function App() {
  const [values, setValues] = useState({ ...startingValues });
  const [prediction, setPrediction] = useState(() => estimateCgpa(startingValues));
  const [appliedValues, setAppliedValues] = useState({ ...startingValues });
  const resultRef = useRef(null);
  const hasUnappliedChanges = fields.some(
    (field) => values[field.name] !== appliedValues[field.name],
  );

  function handleChange(event) {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextPrediction = estimateCgpa(values);
    setPrediction(nextPrediction);
    setAppliedValues({ ...values });
    if (window.matchMedia("(max-width: 680px)").matches) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleReset() {
    const defaults = { ...startingValues };
    setValues(defaults);
    setAppliedValues(defaults);
    setPrediction(estimateCgpa(defaults));
  }

  const score = prediction.toFixed(2);
  const progress = (prediction / 4) * 100;
  const outlook =
    prediction >= 3.5
      ? { title: "Excellent momentum", detail: "Your current inputs point to a strong academic outlook." }
      : prediction >= 3
        ? { title: "A promising outlook", detail: "Keep showing up for your goals—every effort matters." }
        : prediction >= 2
          ? { title: "Room to grow", detail: "Consistent study and attendance can help strengthen your results." }
          : { title: "A fresh opportunity", detail: "Use this estimate as a starting point to plan your next steps." };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Zaeem Sandhu CGPA Prediction home">
          <span className="brand-mark" aria-hidden="true">Z</span>
          <span className="brand-copy">
            <strong>Zaeem Sandhu</strong>
            <span>STUDENT SUCCESS TOOL</span>
          </span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a className="nav-link active" href="#predictor">Predictor</a>
          <a className="nav-link" href="#how-it-works">How it works</a>
          <a className="nav-cta" href="#predictor">Get started <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="home">
        <section className="hero container-fluid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> STUDENT CGPA PREDICTION</div>
            <h1>Your next-semester<br /><span>CGPA, in focus.</span></h1>
            <p className="hero-byline">
              <span className="byline-rule" aria-hidden="true" />
              A student success tool by <strong>Zaeem Sandhu</strong>
            </p>
            <p className="hero-description">
              Explore an indicative estimate of your next-semester CGPA using your
              recent academic performance and study habits.
            </p>
            <div className="hero-points">
              <span><span className="check-icon">✓</span> Personalised insight</span>
              <span><span className="check-icon">✓</span> Takes less than a minute</span>
            </div>
          </div>

          <aside className="hero-note" aria-label="Academic reminder">
            <div className="note-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M4 17.5 9.1 12l3.3 3.2L20 7.5M15.5 7.5H20v4.5" />
              </svg>
            </div>
            <div>
              <span className="note-label">A little progress adds up</span>
              <strong>Make your next semester count.</strong>
              <span className="note-caption">Your goals are closer than you think.</span>
            </div>
          </aside>
        </section>

        <section className="predictor-layout container-fluid" id="predictor">
          <div className="form-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">YOUR DETAILS</span>
                <h2>Build your prediction</h2>
                <p>Enter your details, then choose Predict to update your result.</p>
              </div>
              <span className="step-badge">01 <span>/ 01</span></span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-grid">
                {fields.map((field) => (
                  <div className="field-group" key={field.name}>
                    <label className="field-label" htmlFor={field.name}>
                      <span>{field.label}</span>
                      <span className="field-icon" aria-hidden="true">{field.icon}</span>
                    </label>
                    <div className="input-wrap">
                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={values[field.name]}
                        onChange={handleChange}
                        required
                        aria-describedby={`${field.name}-hint`}
                      />
                      <span className="input-suffix">{field.suffix}</span>
                    </div>
                    <span className="field-hint" id={`${field.name}-hint`}>{field.hint}</span>
                  </div>
                ))}
              </div>
              <div className="form-footer">
                <span className="privacy-note"><span aria-hidden="true">◈</span> Your details stay in this browser</span>
                <div className="form-actions">
                  <button className="reset-button" type="button" onClick={handleReset}>
                    <span aria-hidden="true">↺</span> Reset
                  </button>
                  <button className="predict-button" type="submit">
                    Predict my CGPA <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <aside className="result-card" id="prediction-result" ref={resultRef} aria-live="polite">
            <div className="result-topline">
              <span className="section-kicker">YOUR OUTLOOK</span>
              <span className={`live-badge${hasUnappliedChanges ? " pending" : ""}`}>
                <span /> {hasUnappliedChanges ? "READY TO UPDATE" : "LATEST RESULT"}
              </span>
            </div>
            <h2>Your predicted<br />CGPA</h2>
            <div
              className="score-ring"
              style={{ "--score-progress": `${progress}%` }}
              role="img"
              aria-label={`Estimated CGPA ${score} out of 4`}
            >
              <div className="score-inner">
                <strong>{score}</strong>
                <span>OUT OF 4.00</span>
              </div>
            </div>
            <div className="result-divider" />
            <div className="result-summary">
              <span className="summary-icon" aria-hidden="true">✦</span>
              <p><strong>{outlook.title}</strong><br />{outlook.detail}</p>
            </div>
            <p className="estimate-disclaimer">
              Indicative frontend estimate, not a trained-model prediction. Connect the Random Forest model for results from your dataset.
            </p>
          </aside>
        </section>

        <section className="how-section container-fluid" id="how-it-works">
          <div className="how-intro">
            <span className="section-kicker">SIMPLE BY DESIGN</span>
            <h2>A clearer view of what&apos;s ahead.</h2>
            <p>Your academic habits tell a story. Use the estimate as a guide while you work toward your goals.</p>
          </div>
          <div className="how-steps">
            <article className="how-step">
              <span className="step-number">01</span>
              <h3>Share your progress</h3>
              <p>Add your GPA, attendance, study time and scores.</p>
            </article>
            <article className="how-step">
              <span className="step-number">02</span>
              <h3>Get your estimate</h3>
              <p>See a quick CGPA outlook based on your inputs.</p>
            </article>
            <article className="how-step">
              <span className="step-number">03</span>
              <h3>Keep moving forward</h3>
              <p>Use your results as motivation—not a limit.</p>
            </article>
          </div>
        </section>

        <footer className="page-footer">
          <a className="footer-brand" href="#home"><span className="footer-mark">Z</span> Zaeem Sandhu</a>
          <span>Built to help you plan your next step.</span>
          <span>CGPA is shown on a 4.00 scale.</span>
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
