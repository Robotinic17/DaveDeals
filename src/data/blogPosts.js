import coverImg from "../assets/cover.jpg";
import techImg from "../assets/categories/tech.png";
import travelImg from "../assets/categories/travel.png";
import sneakersImg from "../assets/categories/sneakers.png";
import booksImg from "../assets/categories/books.png";
import furnitureImg from "../assets/categories/furniture.png";
import handbagImg from "../assets/categories/handbag.png";

export const blogPosts = [
  {
    id: "marketplace-momentum",
    slug: "marketplace-momentum",
    title: "Marketplace Momentum: How to Spot Real Value Fast",
    category: "Strategy",
    author: "Jennifer Taylor",
    date: "Jan 18, 2026",
    readTime: "4 min read",
    image: coverImg,
    excerpt:
      "A practical framework for scanning deals, filtering noise, and buying with confidence.",
    featured: true,
    content: [
      "Smart shopping is less about luck and more about systems. When you build a repeatable way to evaluate value, you stop chasing discounts and start making confident choices.",
      "Start with a short list: price history, seller reputation, and real-world use cases. If two of the three look shaky, move on.",
      "Finally, reward consistency. The best deals are often boring and reliable, not the loudest badge on the page.",
    ],
  },
  {
    id: "clean-catalogs",
    slug: "clean-catalogs",
    title: "Clean Catalogs Win: Why Clarity Beats Volume",
    category: "Product",
    author: "Ryan A.",
    date: "Jan 14, 2026",
    readTime: "3 min read",
    image: techImg,
    excerpt:
      "Great marketplaces reduce friction by curating the right options, not every option.",
    featured: false,
    content: [
      "More choice does not always mean better choice. When shoppers face too many options, they freeze or abandon the purchase.",
      "Well-structured categories and consistent product details make discovery effortless.",
      "Curate the top 10 percent with the clearest value and let the rest live behind filters.",
    ],
  },
  {
    id: "seasonal-shopping",
    slug: "seasonal-shopping",
    title: "Seasonal Shopping: How to Time Your Best Buys",
    category: "Guides",
    author: "Jennifer Taylor",
    date: "Jan 09, 2026",
    readTime: "5 min read",
    image: travelImg,
    excerpt:
      "A month-by-month look at what gets cheaper and when to pull the trigger.",
    featured: false,
    content: [
      "Seasonal patterns are predictable: travel gear dips after peak season, furniture discounts hit around major holidays, and tech prices slide after new releases.",
      "Track a few items over time and you will quickly learn the rhythm of the market.",
      "Use this insight to plan, not to rush.",
    ],
  },
  {
    id: "quality-sneakers",
    slug: "quality-sneakers",
    title: "Quality Sneakers: What to Look for Before You Buy",
    category: "Buyer Tips",
    author: "Dana Kim",
    date: "Jan 05, 2026",
    readTime: "4 min read",
    image: sneakersImg,
    excerpt:
      "Materials, sole construction, and fit basics that save you money later.",
    featured: false,
    content: [
      "Great sneakers balance comfort and durability. Check outsole density, stitching quality, and breathability before you check the price.",
      "A slightly higher upfront cost often saves money on replacements.",
      "Look for return-friendly sellers if sizing is uncertain.",
    ],
  },
  {
    id: "modern-reading",
    slug: "modern-reading",
    title: "Modern Reading: Building a Library That Actually Gets Used",
    category: "Lifestyle",
    author: "Zoe Carter",
    date: "Dec 28, 2025",
    readTime: "3 min read",
    image: booksImg,
    excerpt:
      "A simple method for choosing books that match your goals and pace.",
    featured: false,
    content: [
      "Start with a theme for the month: skill, story, or strategy. You will finish more books when the topic stays focused.",
      "Avoid impulse stacks and pick just two titles at a time.",
      "A smaller list keeps your momentum high.",
    ],
  },
  {
    id: "home-refresh",
    slug: "home-refresh",
    title: "Home Refresh: Small Upgrades with Big Impact",
    category: "Home",
    author: "Marcus Lee",
    date: "Dec 20, 2025",
    readTime: "4 min read",
    image: furnitureImg,
    excerpt:
      "Lighting, storage, and soft textures that change the feel of a room fast.",
    featured: false,
    content: [
      "You do not need a full remodel to make a room feel new. Swap one key item: lighting, textiles, or a standout chair.",
      "Focus on comfort and function first. Style should follow.",
      "Buy fewer, better pieces.",
    ],
  },
  {
    id: "statement-bags",
    slug: "statement-bags",
    title: "Statement Bags: Balancing Style and Everyday Use",
    category: "Fashion",
    author: "Ava Brooks",
    date: "Dec 15, 2025",
    readTime: "3 min read",
    image: handbagImg,
    excerpt:
      "How to pick a bag that looks premium and still fits real life.",
    featured: false,
    content: [
      "The best statement pieces are still practical. Consider weight, interior layout, and strap comfort before buying.",
      "Neutral tones help you wear it more often.",
      "When in doubt, prioritize function.",
    ],
  },
];

export const featuredList = blogPosts.filter((post) => post.featured);
export const recentPosts = blogPosts.filter((post) => !post.featured);
