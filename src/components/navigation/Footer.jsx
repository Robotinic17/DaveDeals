import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <div
      style={{ borderTop: "1px solid #eee", padding: "18px 0", color: "#555" }}
    >
      <div style={{ width: "min(1100px, 92%)", margin: "0 auto" }}>
        {t("footer.copyright", { year })}
      </div>
    </div>
  );
}
