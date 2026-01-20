import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Product() {
  const { id } = useParams();
  const { t } = useTranslation();
  return <h1>{t("product.title", { id })}</h1>;
}
