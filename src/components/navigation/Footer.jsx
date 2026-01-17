export default function Footer() {
  return (
    <div
      style={{ borderTop: "1px solid #eee", padding: "18px 0", color: "#555" }}
    >
      <div style={{ width: "min(1100px, 92%)", margin: "0 auto" }}>
        © {new Date().getFullYear()} DaveDeals
      </div>
    </div>
  );
}
