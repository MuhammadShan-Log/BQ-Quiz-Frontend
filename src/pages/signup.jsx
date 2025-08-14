import React, { useState } from "react";
import axios from "axios";

const signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    profilePicture: "",
    fullName: "",
    email: "",
    phone: "",
    role: "Student",
    gender: "Male",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Login successful!");
      } else {
        // Sign Up
        if (formData.password !== formData.confirmPassword) {
          setMessage("Invalid Password");
          setLoading(false);
          return;
        }
        const form = new FormData();
        for (const key in formData) {
          form.append(key, formData[key]);
        }

        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setMessage(res.data.message || "Registration successful!");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50d p-8 ">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-sm border-teal-500 border-4 overflow-hidden">

       
        <div className="bg-teal-500 text-white text-center py-4">
          <h2 className="text-3xl  font-extrabold font-Montserrat pb-1">Quiz Teacher Portal</h2>
          <p className="text-md font-Montserrat"> {isLogin ? "Log in to manage your quizzes" : "Create your account to get started"}</p>
        </div>
        <div className="p-6">
         
          <div className="relative flex mb-6 bg-gray-100 rounded-lg p-1">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-teal-500	 rounded-md shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[calc(50%-2px)]'
                }`}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative w-1/2 py-2 rounded-md transition-all duration-300 ease-in-out z-10 ${isLogin ? 'text-white font-medium' : 'text-gray-600'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative w-1/2 py-2 rounded-md transition-all duration-300 ease-in-out z-10 ${!isLogin ? 'text-white font-medium' : 'text-gray-600'
                }`}
            >
              Sign Up
            </button>
          </div>
       

       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out transform ${!isLogin
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 h-0'
                }`}
            >
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
                className="w-full text-sm text-gray-700 mb-4"
              />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mb-4"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mb-4"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <div className="overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out transform ${!isLogin
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4 h-0'
                }`}
            >
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg transition-colors duration-200"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
                ? "Login"
                : "Sign Up"}
          </button>
        </form>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default signup;
