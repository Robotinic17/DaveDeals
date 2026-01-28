import { Link } from "react-router-dom";
import styles from "./Careers.module.css";
import meetingImg from "../assets/meeting.jpg";

const ROLES = [
  {
    title: "Growth Marketer",
    type: "Marketing",
    location: "Remote",
    summary:
      "Own acquisition, retention, and partnerships that bring the marketplace to life.",
  },
  {
    title: "Frontend Engineer",
    type: "Engineering",
    location: "Remote",
    summary:
      "Build fast, accessible, and beautiful experiences across the platform.",
  },
  {
    title: "Backend Engineer",
    type: "Engineering",
    location: "Remote",
    summary:
      "Design scalable services, APIs, and data pipelines for the marketplace.",
  },
  {
    title: "Fullstack Engineer",
    type: "Engineering",
    location: "Remote",
    summary: "Ship end-to-end features that move the product forward quickly.",
  },
  {
    title: "DevOps Engineer",
    type: "Infrastructure",
    location: "Remote",
    summary:
      "Automate, secure, and scale the platform so the team can move fast.",
  },
];

export default function Careers() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Careers at DaveDeals</p>
          <h1 className={styles.title}>We are building the future of deals</h1>
          <p className={styles.subtitle}>
            We need builders, makers, and storytellers to help DaveDeals scale.
            If you want to create a marketplace that empowers both buyers and
            sellers, you are in the right place.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryBtn} href="#open-roles">
              See the skills we need
            </a>
            <Link className={styles.secondaryBtn} to="/about">
              Learn about DaveDeals
            </Link>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img src={meetingImg} alt="Team collaboration" />
        </div>
      </div>

      <div className={styles.inner}>
        <div id="open-roles" className={styles.roles}>
          <div className={styles.rolesHeader}>
            <h2>Skills we need right now</h2>
            <p>
              These are the core roles that will make DaveDeals explode. Pick
              the one that matches your strength and apply.
            </p>
          </div>
          <div className={styles.roleList}>
            {ROLES.map((role) => (
              <div key={role.title} className={styles.roleCard}>
                <div>
                  <h4 className={styles.roleTitle}>{role.title}</h4>
                  <p className={styles.roleMeta}>
                    {role.type} - {role.location}
                  </p>
                  <p className={styles.roleBody}>{role.summary}</p>
                </div>
                <button type="button" className={styles.roleBtn}>
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
