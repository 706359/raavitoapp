// data/menu.js

// 🔹 Sample food images
const sampleImages = [
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
  "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
  "https://images.pexels.com/photos/1833337/pexels-photo-1833337.jpeg",
  "https://images.pexels.com/photos/4198024/pexels-photo-4198024.jpeg",
  "https://images.pexels.com/photos/844832/pexels-photo-844832.jpeg",
  "https://images.pexels.com/photos/5908176/pexels-photo-5908176.jpeg",
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
  "https://images.pexels.com/photos/1640766/pexels-photo-1640766.jpeg",
  "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg",
];

function getImageById(id) {
  const url = sampleImages[(id - 1) % sampleImages.length];
  return { uri: `${url}?auto=compress&cs=tinysrgb&w=800` };
}

// 🥘 Unique Kitchens with items
export const kitchens = [
  {
    id: "k1",
    name: "Taste of India",
    rating: 4.2,
    time: "30 mins",
    image: getImageById(1),
    discount: "20% OFF upto ₹100",
    items: [
      {
        id: "i1",
        name: "Dal Makhani Thali",
        price: 120,
        image: getImageById(2),
        desc: "Dal makhani, roti, chawal, salad.",
      },
      {
        id: "i2",
        name: "Paneer Butter Masala Thali",
        price: 150,
        image: getImageById(3),
        desc: "Paneer butter masala, roti, rice.",
      },
    ],
  },
  {
    id: "k2",
    name: "Kitchen Master",
    rating: 4.8,
    time: "25 mins",
    image: getImageById(2),
    discount: "Flat ₹50 OFF",
    items: [
      {
        id: "i3",
        name: "Rajma Chawal",
        price: 100,
        image: getImageById(4),
        desc: "Homestyle rajma with basmati chawal.",
      },
      {
        id: "i4",
        name: "Aloo Gobhi + Rotis",
        price: 90,
        image: getImageById(5),
        desc: "Dry sabzi with soft rotis.",
      },
    ],
  },
  {
    id: "k3",
    name: "Ritu's Rasoi",
    rating: 5.0,
    time: "20 mins",
    image: getImageById(3),
    discount: "Free Delivery",
    items: [
      {
        id: "i5",
        name: "Veg Pulao",
        price: 110,
        image: getImageById(6),
        desc: "Fragrant basmati rice with mixed veg.",
      },
      {
        id: "i6",
        name: "Mix Sabzi + 4 Rotis",
        price: 100,
        image: getImageById(7),
        desc: "Seasonal vegetables with rotis.",
      },
    ],
  },
  {
    id: "k4",
    name: "Jai Shankar Dining",
    rating: 4.9,
    time: "20 mins",
    image: getImageById(4),
    discount: "10% OFF",
    items: [
      {
        id: "i7",
        name: "Khichdi + Curd",
        price: 90,
        image: getImageById(8),
        desc: "Moong dal khichdi with homemade curd.",
      },
    ],
  },
  {
    id: "k5",
    name: "Annapurna Bhojanalay",
    rating: 4.3,
    time: "35 mins",
    image: getImageById(5),
    discount: "25% OFF Family Packs",
    items: [
      {
        id: "i8",
        name: "Vegetable Khichdi",
        price: 120,
        image: getImageById(9),
        desc: "Khichdi with seasonal vegetables.",
      },
      {
        id: "i9",
        name: "Masala Khichdi",
        price: 130,
        image: getImageById(10),
        desc: "Spiced khichdi with tadka.",
      },
    ],
  },
  {
    id: "k6",
    name: "Healthy Rasoi",
    rating: 4.7,
    time: "28 mins",
    image: getImageById(6),
    discount: "Buy 1 Get 1 Free",
    items: [
      {
        id: "i10",
        name: "Low Oil Sabzi + Rotis",
        price: 110,
        image: getImageById(1),
        desc: "Healthy tiffin with less oil.",
      },
      {
        id: "i11",
        name: "Protein Rich Thali",
        price: 140,
        image: getImageById(2),
        desc: "Dal, paneer, salad and roti.",
      },
    ],
  },
  {
    id: "k7",
    name: "Maa Ki Rasoi",
    rating: 4.5,
    time: "30 mins",
    image: getImageById(7),
    discount: "₹30 OFF Above ₹199",
    items: [
      {
        id: "i12",
        name: "Aloo Paratha + Curd",
        price: 90,
        image: getImageById(3),
        desc: "Stuffed paratha with curd and pickle.",
      },
    ],
  },
  {
    id: "k8",
    name: "Spice & Tiffin",
    rating: 4.6,
    time: "22 mins",
    image: getImageById(8),
    discount: "15% OFF",
    items: [
      {
        id: "i13",
        name: "Chole Bhature",
        price: 120,
        image: getImageById(4),
        desc: "Authentic Punjabi chole with fluffy bhature.",
      },
    ],
  },
  {
    id: "k9",
    name: "Home Delight",
    rating: 4.4,
    time: "27 mins",
    image: getImageById(9),
    discount: "Free Sweet with Meal",
    items: [
      {
        id: "i14",
        name: "Veg Thali Deluxe",
        price: 150,
        image: getImageById(5),
        desc: "Dal, 2 sabzis, roti, rice, salad, dessert.",
      },
    ],
  },
  {
    id: "k10",
    name: "The Veggie Rasoi",
    rating: 4.9,
    time: "18 mins",
    image: getImageById(10),
    discount: "20% OFF First Order",
    items: [
      {
        id: "i15",
        name: "Paneer Tikka Masala",
        price: 160,
        image: getImageById(6),
        desc: "Grilled paneer cubes in spicy gravy.",
      },
    ],
  },
];

// 🔹 Flatten all items
export const allItems = kitchens.flatMap((k) => k.items);
