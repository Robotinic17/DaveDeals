import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./Topbar.module.css";
import { useTranslation } from "react-i18next";

export default function Topbar() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={styles.topbar}
    >
      <div className="container mx-auto flex items-center justify-between">
        <span className={styles.text}>+001234567890</span>

        <p className={`${styles.text} hidden sm:block`}>
          Get 50% Off on Selected Items
        </p>

        <div className="flex items-center gap-4">
          <button className={styles.control}>
            EN <ChevronDown size={14} />
          </button>
          <button className={styles.control}>
            Location <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
