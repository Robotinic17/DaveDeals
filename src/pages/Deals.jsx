import { useParams } from "react-router-dom";

export default function Deals() {
  const { type } = useParams();
  return <h1>Deals: {type}</h1>;
}
