import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function WelcomePage() {
  const { user, setShowWelcome } = useAuth(); // useAuth now exposes setShowWelcome
  const navigate = useNavigate();

  const handleContinue = () => {
    // Hide the Welcome page
    setShowWelcome(false);
    // Navigate to onboarding
    navigate("/onboarding");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white font-fragment overflow-hidden">
      {/* Animated subtle background */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(270deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,1) 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Welcome to Devsta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-base md:text-lg text-gray-300 mb-10"
        >
          {user?.name ? `${user.name}, ` : ""}to personalize your Devsta experience, we just need a few quick details.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="px-8 py-3 rounded-lg text-base md:text-lg font-medium border border-white text-white bg-transparent hover:bg-primary hover:border-primary transition-all"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
