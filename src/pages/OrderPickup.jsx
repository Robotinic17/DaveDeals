import { MapPin, Clock, BadgeCheck, Truck } from "lucide-react";
import styles from "./OrderPickup.module.css";

const pickupSteps = [
  {
    title: "Place your order",
    body: "Choose Order Pickup at checkout and select a pickup location.",
  },
  {
    title: "We prepare it",
    body: "Sellers pack your order and confirm it is ready for pickup.",
  },
  {
    title: "Get notified",
    body: "You will receive a pickup code and ready-for-pickup notification.",
  },
  {
    title: "Pick up in minutes",
    body: "Bring your ID and pickup code to collect your order.",
  },
];

export default function OrderPickup() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Order Pickup</p>
          <h1 className={styles.title}>Skip delivery, pick up faster</h1>
          <p className={styles.subtitle}>
            Order Pickup is perfect for same-day needs. Select a pickup location
            at checkout and collect your items on your schedule.
          </p>
          <div className={styles.heroMeta}>
            <span>
              <Clock size={14} /> Ready in 2-4 hours (select sellers)
            </span>
            <span>
              <MapPin size={14} /> Local pickup locations
            </span>
            <span>
              <BadgeCheck size={14} /> ID verification at pickup
            </span>
          </div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroCardHeader}>
            <Truck size={18} />
            <span>Pickup requirements</span>
          </div>
          <ul className={styles.checklist}>
            <li>Government-issued ID</li>
            <li>Pickup code from your confirmation email</li>
            <li>Order must be collected within 5 days</li>
          </ul>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>How pickup works</h2>
        <p>Four steps from checkout to pickup counter.</p>
      </div>
      <div className={styles.stepsGrid}>
        {pickupSteps.map((step, idx) => (
          <div key={step.title} className={styles.stepCard}>
            <span className={styles.stepIndex}>{idx + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>

      <div className={styles.notice}>
        <strong>Need to change pickup details?</strong> Contact support before
        the pickup deadline so we can update the order.
      </div>
    </section>
  );
}
