import { Truck, Clock, MapPin, BadgeCheck } from "lucide-react";
import styles from "./ShippingDelivery.module.css";

const deliverySteps = [
  {
    title: "Order confirmation",
    body: "We verify your order and send a confirmation within minutes.",
  },
  {
    title: "Seller handoff",
    body: "Sellers prepare items and schedule pickup for delivery.",
  },
  {
    title: "In transit",
    body: "Track your package with live status updates and route visibility.",
  },
  {
    title: "Delivered",
    body: "Receive your item and get a delivery confirmation.",
  },
];

const deliveryOptions = [
  {
    title: "Standard delivery",
    body: "3-5 business days for most regions.",
  },
  {
    title: "Express delivery",
    body: "1-2 business days in supported cities.",
  },
  {
    title: "Same-day",
    body: "Limited availability for select sellers and locations.",
  },
];

export default function ShippingDelivery() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Shipping & Delivery</p>
          <h1 className={styles.title}>Fast, trackable delivery</h1>
          <p className={styles.subtitle}>
            DaveDeals partners with trusted logistics providers to deliver your
            orders on time with clear tracking at every step.
          </p>
          <div className={styles.heroMeta}>
            <span>
              <Clock size={14} /> Delivery updates in real time
            </span>
            <span>
              <MapPin size={14} /> Regional + cross-border coverage
            </span>
            <span>
              <BadgeCheck size={14} /> Verified seller handoff
            </span>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroCardHeader}>
            <Truck size={18} />
            <span>Delivery options</span>
          </div>
          <div className={styles.optionList}>
            {deliveryOptions.map((option) => (
              <div key={option.title} className={styles.optionItem}>
                <h3>{option.title}</h3>
                <p>{option.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>How delivery works</h2>
        <p>From checkout to doorstep, here is what to expect.</p>
      </div>
      <div className={styles.stepsGrid}>
        {deliverySteps.map((step, idx) => (
          <div key={step.title} className={styles.stepCard}>
            <span className={styles.stepIndex}>{idx + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <h2>Tracking and updates</h2>
        <p>
          You will receive tracking updates by email and inside your account
          dashboard. Every shipment includes a unique tracking ID.
        </p>
      </div>
      <div className={styles.notice}>
        <strong>Need help?</strong> Contact support if tracking has not updated
        within 48 hours.
      </div>
    </section>
  );
}
