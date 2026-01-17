export default function Topbar() {
  return (
    <div style={{ background: "#0b4b3f", color: "white", padding: "10px 0" }}>
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>+001234567890</span>
        <span>50% OFF Selected Items</span>
        <span>ENG</span>
      </div>
    </div>
  );
}
