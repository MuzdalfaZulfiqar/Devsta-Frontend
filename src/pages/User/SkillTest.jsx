import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_URL } from "../../../config";

export default function SkillTest() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizToken, setQuizToken] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check quiz status before starting
  useEffect(() => {
    if (!token) return;

    const initQuiz = async () => {
      try {
        // 1️⃣ Check if user already attempted quiz
        const statusRes = await fetch(`${BACKEND_URL}/api/quiz/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statusData = await statusRes.json();
        if (statusData.finished) {
          alert(`You have already attempted this quiz. Your score: ${statusData.score}/${statusData.outOf}`);
          navigate("/dashboard");
          return;
        }

        // 2️⃣ Start quiz
        const res = await fetch(`${BACKEND_URL}/api/quiz/start`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) {
          alert("Failed to start quiz: " + (data.msg || "Unknown error"));
          navigate("/dashboard");
          return;
        }

        setQuestions(data.questions);
        setQuizToken(data.token);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch quiz");
        navigate("/dashboard");
      }
    };

    initQuiz();
  }, [token, navigate]);

  if (loading) return <div className="p-10 text-center">Loading quiz...</div>;

  const question = questions[current];

  const handleOptionSelect = (questionId, optionIdx) => {
    setAnswers((p) => ({ ...p, [questionId]: optionIdx }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((s) => s + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!quizToken) return;

    const payload = {
      token: quizToken,
      answers: Object.entries(answers).map(([id, choice]) => ({ id, choice })),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || "Failed to submit quiz");
        return;
      }

      setScoreData(data);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz");
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen font-fragment relative overflow-hidden bg-gradient-to-br from-[#fafafa] via-[#f4f4f4] to-[#e9e9e9]">
      {/* Background */}
      <div className="absolute top-[-5rem] left-[-5rem] w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-5rem] right-[-5rem] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-gray-200 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-primary transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            DevSta Skill Test
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Question {current + 1} / {questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full flex justify-center bg-white py-8 border-b border-gray-100">
        <div className="flex items-center justify-between gap-6 w-full max-w-5xl px-8 relative">
          {questions.map((q, i) => {
            const isActive = i === current;
            const isAnswered = answers[q._id] !== undefined;
            const isCompleted = i < current;

            return (
              <div key={q._id} className="flex-1 flex flex-col items-center relative">
                {i < questions.length - 1 && (
                  <motion.div
                    className="absolute top-1/2 left-full h-[4px] rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: isCompleted ? "100%" : "0%",
                      background: isCompleted
                        ? "linear-gradient(to right, #185d61ff, #2b7d83)"
                        : "linear-gradient(to right, #e5e7eb, #e5e7eb)",
                      boxShadow: isCompleted ? "0 0 8px #185d61aa" : "0 0 0px transparent",
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                )}

                <motion.button
                  layout
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrent(i)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold shadow-sm transition-all
                    ${
                      isActive
                        ? "bg-[#185d61ff] text-white border-[#185d61ff] ring-4 ring-[#185d61ff]/30"
                        : isAnswered
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                >
                  {i + 1}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-3xl border border-gray-200 overflow-hidden p-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-snug">
            {question.text}
          </h2>

          <div className="flex flex-col gap-4">
            {question.options.map((opt, idx) => {
              const checked = answers[question._id] === idx;
              return (
                <label
                  key={idx}
                  className={`border rounded-xl px-5 py-3 cursor-pointer text-sm sm:text-base transition
                    ${
                      checked
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                >
                  <input
                    type="radio"
                    name={`q-${question._id}`}
                    checked={checked}
                    onChange={() => handleOptionSelect(question._id, idx)}
                    className="hidden"
                  />
                  {opt}
                </label>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 items-center">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-4">
              {answers[question._id] !== undefined && (
                <button
                  onClick={() =>
                    setAnswers((p) => {
                      const copy = { ...p };
                      delete copy[question._id];
                      return copy;
                    })
                  }
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Clear
                </button>
              )}

              {current < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                >
                  Submit Test <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccess}
        message={
          scoreData
            ? `You’ve successfully completed the DevSta Skill Test! Your score: ${scoreData.score} / ${scoreData.outOf}`
            : "You’ve successfully completed the DevSta Skill Test!"
        }
        onClose={handleCloseModal}
      />
    </div>
  );
}
