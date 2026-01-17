import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{ borderBottom: "1px solid #eee", padding: "14px 0" }}>
      <div
        style={{
          width: "min(1100px, 92%)",
          margin: "0 auto",
          display: "flex",
          gap: 16,
        }}
      >
        <Link to="/" style={{ fontWeight: 800 }}>
          DaveDeals
        </Link>
        <Link to="/c/tech">Tech</Link>
        <Link to="/c/furniture">Furniture</Link>
        <Link to="/deals/top">Top Deals</Link>
        <Link to="/cart" style={{ marginLeft: "auto" }}>
          Cart
        </Link>
      </div>
    </div>
  );
}
