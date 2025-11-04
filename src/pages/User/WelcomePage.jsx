// The one with animations
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function WelcomePage() {
  const { user, setShowWelcome } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowWelcome(false);
    navigate("/onboarding");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white font-fragment overflow-hidden">

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Large Teal Circle */}
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-primary/50"
          initial={{ x: -300, y: 100 }}
          animate={{ x: [-300, 800, -300], y: [100, 500, 100], rotate: [0, 360, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Middle-sized Circle with different shade */}
        <motion.div
          className="absolute w-52 h-52 rounded-full bg-primary/30"
          initial={{ x: 600, y: 200 }}
          animate={{ x: [600, -200, 600], y: [200, 400, 200], rotate: [0, 360, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Medium White Circle */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-white/40"
          initial={{ x: 500, y: -100 }}
          animate={{ x: [500, -300, 500], y: [-100, 450, -100], rotate: [0, 360, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Extra Small Teal Circle */}
        <motion.div
          className="absolute w-28 h-28 rounded-full bg-primary/70"
          initial={{ x: -200, y: 400 }}
          animate={{ x: [-200, 600, -200], y: [400, 50, 400], rotate: [0, 360, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bordered Square Frame */}
        <motion.div
          className="absolute w-48 h-48 border-4 border-primary/50"
          initial={{ x: 300, y: 50 }}
          animate={{ x: [300, 700, 300], y: [50, 500, 50], rotate: [0, 360, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 text-center px-6 max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white"
        >
          Welcome to <span className="text-primary">DevSta</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-100 mb-10"
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
          className="px-8 py-3 rounded-lg text-base md:text-lg font-medium border border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
