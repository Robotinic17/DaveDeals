import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import styles from "./Topbar.module.css";

const MANUAL_LANG_KEY = "dd_lang_manual";

const LANG_OPTIONS = [
  { code: "en", short: "EN", name: "English" },
  { code: "fr", short: "FR", name: "French" },
  { code: "es", short: "ES", name: "Spanish" },
  { code: "de", short: "DE", name: "German" },
  { code: "pt", short: "PT", name: "Portuguese" },
  { code: "ar", short: "AR", name: "Arabic" },
];

const REGION_OPTIONS = [
  { code: "US", label: "United States" },
  { code: "EU", label: "Europe" },
  { code: "NG", label: "Nigeria" },
  { code: "CN", label: "China" },
];

const REGION_KEY = "dd_region";

function normalizeLang(value) {
  return (value || "en").split("-")[0];
}

export default function Topbar() {
  const { t } = useTranslation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const [region, setRegion] = useState(() => {
    const saved = localStorage.getItem(REGION_KEY);
    return saved || "US";
  });

  const langRef = useRef(null);
  const regionRef = useRef(null);

  const currentLang = normalizeLang(i18n.language);

  useEffect(() => {
    const applyDir = (lng) => {
      const lang = (lng || i18n.language || "en").split("-")[0];
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    applyDir(i18n.language);

    const onChange = (lng) => applyDir(lng);
    i18n.on("languageChanged", onChange);

    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (langRef.current && !langRef.current.contains(e.target))
        setIsLangOpen(false);
      if (regionRef.current && !regionRef.current.contains(e.target))
        setIsRegionOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleLang() {
    setIsLangOpen((v) => !v);
    setIsRegionOpen(false);
  }

  function toggleRegion() {
    setIsRegionOpen((v) => !v);
    setIsLangOpen(false);
  }

  async function selectLanguage(code) {
    localStorage.setItem(MANUAL_LANG_KEY, "1");
    await i18n.changeLanguage(code);
    setIsLangOpen(false);
  }

  function selectRegion(code) {
    setRegion(code);
    localStorage.setItem(REGION_KEY, code);
    setIsRegionOpen(false);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={styles.topbar}
    >
      <div className="container mx-auto flex items-center justify-between">
        <span className={styles.text}>{t("topbar.phone")}</span>

        <p className={`${styles.text} hidden sm:block`}>{t("topbar.promo")}</p>

        <div className="flex items-center gap-4">
          <div className="relative" ref={langRef}>
            <button
              type="button"
              className={styles.control}
              onClick={toggleLang}
            >
              {LANG_OPTIONS.find((x) => x.code === currentLang)?.short || "EN"}
              <ChevronDown size={14} />
            </button>

            {isLangOpen && (
              <div className={styles.dropdown} role="menu">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => selectLanguage(opt.code)}
                    role="menuitem"
                  >
                    <span className={styles.langRow}>
                      <span>{opt.name}</span>
                      <span className={styles.langShort}>{opt.short}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={regionRef}>
            <button
              type="button"
              className={styles.control}
              onClick={toggleRegion}
            >
              {region}
              <ChevronDown size={14} />
            </button>

            {isRegionOpen && (
              <div className={styles.dropdown} role="menu">
                {REGION_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => selectRegion(opt.code)}
                    role="menuitem"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
