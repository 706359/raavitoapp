// data/menu.js

// sample food images
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

// 🍱 Menu categories
export const menuCategories = [
  {
    title: "Full Tiffin",
    icon: "fast-food-outline",
    items: [
      {
        id: 1,
        name: "Full Tiffin (Standard)",
        price: 120,
        image: getImageById(1),
        desc: "Complete homemade thali with dal, sabzi, roti, chawal and salad.",
      },
    ],
  },
  {
    title: "Mix Match Tiffin",
    icon: "restaurant-outline",
    items: [
      {
        id: 2,
        name: "1 Sabzi + 4 Rotis + Chawal",
        price: 100,
        image: getImageById(2),
        desc: "Balanced plate with sabzi, 4 rotis and rice.",
      },
      {
        id: 3,
        name: "2 Sabzis + 4 Rotis",
        price: 120,
        image: getImageById(3),
        desc: "Two veg sabzis with rotis.",
      },
      {
        id: 4,
        name: "1 Sabzi + 6 Rotis",
        price: 100,
        image: getImageById(4),
        desc: "Extra rotis for bigger appetite.",
      },
      {
        id: 5,
        name: "1 Sabzi + 4 Rotis",
        price: 80,
        image: getImageById(5),
        desc: "Simple and light option.",
      },
      {
        id: 6,
        name: "1 Sabzi + 2 Bowls Chawal",
        price: 100,
        image: getImageById(6),
        desc: "Sabzi with two bowls of rice.",
      },
      {
        id: 7,
        name: "Only 1 Sabzi",
        price: 40,
        image: getImageById(7),
        desc: "Single sabzi portion.",
      },
    ],
  },
  {
    title: "Khichdi Tiffin",
    icon: "leaf-outline",
    items: [
      {
        id: 8,
        name: "Moong Dal Khichdi",
        price: 120,
        image: getImageById(8),
        desc: "Protein-rich moong khichdi.",
      },
      {
        id: 9,
        name: "Vegetable Khichdi",
        price: 130,
        image: getImageById(9),
        desc: "Khichdi with seasonal vegetables.",
      },
      {
        id: 10,
        name: "Masala Khichdi",
        price: 120,
        image: getImageById(10),
        desc: "Spiced khichdi with tadka.",
      },
    ],
  },
];

// flatten all items
export const allItems = menuCategories.flatMap((c) => c.items);

// 👩‍🍳 Kitchens (10 examples)
export const kitchens = [
  {
    id: "k1",
    name: "Taste of India Tiffin Services",
    rating: 4.2,
    time: "30 mins",
    image: getImageById(1),
    popular: [1, 2, 3], // item ids from menu
  },
  {
    id: "k2",
    name: "Kitchen Master",
    rating: 4.8,
    time: "25 mins",
    image: getImageById(2),
    popular: [4, 5],
  },
  {
    id: "k3",
    name: "HomeChef Ritu's Rasoi",
    rating: 5.0,
    time: "20 mins",
    image: getImageById(3),
    popular: [6, 7],
  },
  {
    id: "k4",
    name: "Jai Shankar Dining",
    rating: 4.9,
    time: "20 mins",
    image: getImageById(4),
    popular: [8],
  },
  {
    id: "k5",
    name: "Annapurna Bhojanalay",
    rating: 4.3,
    time: "35 mins",
    image: getImageById(5),
    popular: [9, 10],
  },
  {
    id: "k6",
    name: "Healthy Rasoi",
    rating: 4.7,
    time: "28 mins",
    image: getImageById(6),
    popular: [2, 8],
  },
  {
    id: "k7",
    name: "Maa Ki Rasoi",
    rating: 4.5,
    time: "30 mins",
    image: getImageById(7),
    popular: [1, 9],
  },
  {
    id: "k8",
    name: "Spice & Tiffin",
    rating: 4.6,
    time: "22 mins",
    image: getImageById(8),
    popular: [3, 10],
  },
  {
    id: "k9",
    name: "Home Delight Kitchen",
    rating: 4.4,
    time: "27 mins",
    image: getImageById(9),
    popular: [5, 6],
  },
  {
    id: "k10",
    name: "The Veggie Rasoi",
    rating: 4.9,
    time: "18 mins",
    image: getImageById(10),
    popular: [7, 8],
  },
];
