import { useTranslation } from "react-i18next";

export default function Checkout() {
  const { t } = useTranslation();
  return <h1>{t("checkout.pageTitle")}</h1>;
}
