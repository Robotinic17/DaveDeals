import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="heading text-5xl"
    >
      Framer Motion Ready
    </motion.h1>
  );
}
