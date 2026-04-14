import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-cardBg backdrop-blur-md border border-borderDark rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
