// #made by chhavi :)

const DEFAULT_KEYWORDS = [
  ["7-11", "Groceries"],
  ["7-Eleven", "Groceries"],
  ["FamilyMart", "Groceries"],
  ["全家", "Groceries"],
  ["PX Mart", "Groceries"],
  ["全聯", "Groceries"],
  ["night market", "Dining Out"],
  ["夜市", "Dining Out"],
  ["market", "Groceries"],
  ["bubble tea", "Dining Out"],
  ["boba", "Dining Out"],
  ["珍奶", "Dining Out"],
  ["din tai fung", "Dining Out"],
  ["bento", "Dining Out"],
  ["便當", "Dining Out"],
  ["MRT", "Transport"],
  ["捷運", "Transport"],
  ["YouBike", "Transport"],
  ["Bus", "Transport"],
  ["公車", "Transport"],
  ["tuition", "Education"],
  ["textbook", "Education"],
  ["books", "Education"],
  ["Dorm", "Housing"],
  ["Rent", "Housing"],
  ["electricity", "Utilities"],
  ["water bill", "Utilities"],
  ["SIM card", "Telecom"],
];

let keywords = [...DEFAULT_KEYWORDS];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(keywords);
  } else if (req.method === 'PUT') {
    const newKeywords = req.body;
    if (!Array.isArray(newKeywords)) {
      return res.status(400).json({ error: "Body must be an array of [keyword, category] pairs" });
    }
    keywords = newKeywords;
    res.status(200).json(keywords);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
