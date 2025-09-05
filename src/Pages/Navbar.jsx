// Navbar.jsx
import { useReducer, useEffect } from "react";
import { FiUserPlus, FiUser, FiSearch,FiX,FiShoppingCart} from "react-icons/fi";

const initialState = {
  isModalOpen: false,
  isRegisterMode: false,
  username: "",
  password: "",
  confirmPassword: "",
  loggedInUser: null,
  error: "",
  profileMenuOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MODAL":
      return { ...state, isModalOpen: action.payload };
    case "SET_REGISTER_MODE":
      return { ...state, isRegisterMode: action.payload };
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_LOGGED_IN_USER":
      return { ...state, loggedInUser: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_PROFILE_MENU":
      return { ...state, profileMenuOpen: action.payload };
    case "RESET_FORM":
      return { ...state, username: "", password: "", confirmPassword: "", error: "" };
    default:
      return state;
  }
}

export default function Navbar({ handleSearchchange,handlecategory,selectedcategory,setselectedCategories}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isModalOpen,
    isRegisterMode,
    username,
    password,
    confirmPassword,
    loggedInUser,
    error,
    profileMenuOpen,
  } = state; //object destructuring

  // Load logged-in user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      dispatch({ type: "SET_LOGGED_IN_USER", payload: savedUser });
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(
      (u) => u.username === username && u.password === password
    );

    if (userExists) {
      dispatch({ type: "SET_LOGGED_IN_USER", payload: username });
      localStorage.setItem("loggedInUser", username);
      dispatch({ type: "SET_MODAL", payload: false });
      dispatch({ type: "RESET_FORM" });
    } else {
      dispatch({ type: "SET_ERROR", payload: "Invalid username or password" });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Passwords do not match!" });
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((u) => u.username === username);

    if (userExists) {
      dispatch({ type: "SET_ERROR", payload: "User already exists!" });
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    dispatch({ type: "SET_REGISTER_MODE", payload: false });
    dispatch({ type: "RESET_FORM" });
    dispatch({ type: "SET_ERROR", payload: "Registered successfully! Please login." });
  };

  const handleLogout = () => {
    dispatch({ type: "SET_LOGGED_IN_USER", payload: null });
    localStorage.removeItem("loggedInUser");
    dispatch({ type: "SET_PROFILE_MENU", payload: false });
  };

  return (
    <div className="bg-sky-200 p-4 w-full flex items-center justify-between sticky top-0 z-50 gap-4 shadow-md">
      {/* Left side: Logo + Search */}
      <div className="flex items-center gap-3 flex-1">
        <img
          src="logo.png"
          alt="Logo"
          className="w-[60px] h-[60px] rounded-3xl"
        />
        <div className="w-30 text-sky-500 p-3 bg-white rounded-3xl cursor-pointer" >
          <select value={selectedcategory}
          onChange={(e)=>setselectedCategories(e.target.value)}>
          <option value="All">All Categories</option>
                {handlecategory.map((s,i)=>
                <option key={i} value={s}>
                {s}
          </option>)}
          </select>
        </div>
        <div className="relative w-full max-w-9xl">
          <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2
           text-gray-400 opacity-50" size={25} />
          <input
            type="text"
            className="bg-white p-3 pl-10 rounded-3xl w-full"
            placeholder="Search for Products"
            onChange={handleSearchchange}
          />
        </div>
      </div>

      {/* Right side: Login / Profile + Cart */}
      <div className="flex items-center gap-3 relative">
        {!loggedInUser ? (
          <button
            onClick={() => {
              dispatch({ type: "SET_REGISTER_MODE", payload: false });
              dispatch({ type: "SET_MODAL", payload: true });
            }}
            className="bg-sky-600 px-4 py-4 rounded-4xl text-white font-semibold hover:bg-sky-500"
          >
            <FiUser size={20} />
          </button>
        ) : (
          <div className="relative">
            <div
              onClick={() => dispatch({ type: "SET_PROFILE_MENU", payload: !profileMenuOpen })}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-600 text-white font-bold cursor-pointer"
            >
              {loggedInUser[0].toUpperCase()}
            </div>

            {profileMenuOpen && (
              <div className="absolute right-2 mt-3 ml-[500px] w-30 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cart */}
        <div className="relative">
          <button className="p-3 bg-white rounded-full">
                <FiShoppingCart size={24} className="text-gray-800 hover:text-sky-400 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200/50 backdrop-blur-sm transition-all">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center justify-center border rounded-full w-16 h-16 gap-2 p-4 mx-auto bg-gray-100">
              {isRegisterMode ? <FiUserPlus size={40} /> : <FiUser size={40} />}
            </h2>
            <form
              onSubmit={isRegisterMode ? handleRegister : handleLogin}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => dispatch({ type: "SET_USERNAME", payload: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              {isRegisterMode && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-500"
              >
                {isRegisterMode ? "Register" : "Login"}
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => dispatch({ type: "SET_REGISTER_MODE", payload: false })}
                    className="text-sky-600 hover:underline"
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => dispatch({ type: "SET_REGISTER_MODE", payload: true })}
                    className="text-sky-600 hover:underline"
                  >
                    Register here
                  </button>
                </>
              )}
            </p>

            <button
              onClick={() => dispatch({ type: "SET_MODAL", payload: false })}
              className="absolute top-4 right-5 text-red-400 text-sm hover:text-red-500 cursor-pointer"
            >
             <FiX size={40}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
