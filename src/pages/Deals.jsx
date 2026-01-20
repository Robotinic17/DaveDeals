import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Deals() {
  const { type } = useParams();
  const { t } = useTranslation();
  return <h1>{t("deals.title", { type })}</h1>;
}
