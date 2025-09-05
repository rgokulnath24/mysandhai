import { useEffect, useState } from "react";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import {FaBan } from "react-icons/fa";
import Navbar from "../Pages/Navbar";  // ✅ import Navbar;
import { motion } from "framer-motion";

export default function Api_Effect() {
  // ✅ Skeleton for ONE product card
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image */}
      <div className="flex justify-center items-center p-4 bg-gray-100">
        <div className="w-[200px] h-[200px] bg-gray-300 rounded-md"></div>
      </div>

      {/* Content */}
      <div className="p-4 text-center">
        {/* Title */}
        <div className="h-5 bg-gray-300 rounded mb-3 w-3/4 mx-auto"></div>
        {/* Price */}
        <div className="h-6 bg-gray-300 rounded mb-3 w-1/2 mx-auto"></div>
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
            key={i}
            className="w-4 h-4 text-gray-300 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
            >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.065 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.065 3.292c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.877 2.034c-.785.57-1.84-.197-1.54-1.118l1.065-3.292a1 1 0 00-.364-1.118L3.484 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.065-3.292z"/>
            </svg>
          ))}
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <div className="h-9 w-24 bg-gray-300 rounded-lg"></div>
          <div className="h-9 w-24 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const [loading, setloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategories, setselectedCategories] = useState("All");
  const [Categories, setCategories] = useState([]);
  const [Error, setError] = useState(false);


const renderstars = (rating) => {
  const fullStars = Math.floor(rating);     // number of fully filled stars
  const hasPartial = rating % 1;            // fractional part (0.2, 0.7, etc.)

  return Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      // full star
      return <StarSolid key={i} className="text-yellow-400 w-[18px] h-[18px]" />;
    } else if (i === fullStars && hasPartial > 0) {
      // partial star
      return (
        <div key={i} className="relative w-[18px] h-[18px]">
          <StarOutline className="absolute text-yellow-400 w-[18px] h-[18px]" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${hasPartial * 100}%` }}
          >
            <StarSolid className="text-yellow-400 w-[18px] h-[18px]" />
          </div>
        </div>
      );
    } else {
      // empty star
      return <StarOutline key={i} className="text-yellow-400 w-[18px] h-[18px]" />;
    }
  });
};


  useEffect(() => {
    setloading(true);
    fetch("https://fakestoreapi.com/products?limit=17")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const new_cat=[...new Set(data.map((p)=>p.category))];
        setCategories(new_cat);
        setloading(false);
      })
      .catch((err) => {
        console.error("something wrong", err);
        setloading(false);
      });
  }, []);
  const handleSearchchange=(e)=>
  {
    const value=e.target.value;
    setSearch(value);
  }
//     selectedCategories;
//     // if(value.length>0)
//     // {
//     if (value.length > 0) {
//       selectedCategories==Categories;
//       const filteredsuggestion = products.filter((p) =>
//       p.title.toLowerCase().includes(value.toLowerCase())
//     );

//     if (filteredsuggestion.length > 0) {
//       setSuggestions(filteredsuggestion.slice(0, 5));
//       setError(false);   // reset error
//     } else {
//       setSuggestions([]);
//       setError(true);    // no match → show error
//     }
//   } else {
//     setSuggestions([]);
//     setError(false);     // reset when search cleared
//   }
// }
    // else
    // {
    //   setSuggestions([]);
    // }All
  // }
  const filteredproducts=products.filter((p)=>
  {
    const matched_category=selectedCategories==="All" || p.category===selectedCategories;
    const matched_search=search.trim()==="" || p.title.toLowerCase().includes(search.toLowerCase());
    return matched_category && matched_search;
  })

  return (
<div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
    <Navbar handleSearchchange={handleSearchchange} handlecategory={Categories} selectedcategory={selectedCategories} setselectedCategories={setselectedCategories}/>

      {/* Grid */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 p-6">
        {loading
          ? Array.from({ length: 8 }).map((_, ix) => (
              <SkeletonCard key={ix} />
            ))
          : (filteredproducts.length===0)?
            (
              <div className="col-span-full flex items-center mx-auto gap-3 text-sky-800 font-semibold">
                <FaBan size={40} className="text-red-400"/>No Products Found
              </div>
            ):
          
          filteredproducts.map((k, index) => (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-All duration-300"
              >
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex justify-center items-center p-4 bg-gray-50"
                >
                  <img
                    src={k.image}
                    className="w-[200px] h-[200px] object-contain"
                    alt={k.title}
                  />
                </motion.div>

                {/* Content */}
                <div className="p-4 text-center">
                  <div className="text-base font-medium text-gray-700 h-[50px] overflow-hidden">
                    {k.title.slice(0, 50)}
                  </div>
                  <div className="text-xl font-bold text-blue-700 mt-2">
                    ${k.price}
                  </div>
                  <div className="flex justify-center mt-2">
                    {renderstars(k.rating.rate)}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center gap-3 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition-All"
                    >
                      🛒 Add to Cart
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-300 transition-All"
                    >
                      ⚡ Buy Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}

      </div>
    </div>
  );
}
