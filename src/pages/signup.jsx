import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    profilePicture: "",
    fullName: "",
    email: "",
    enrollmentCourseID: "",
    phone: "",
    role: "student",
    gender: "Male",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      let res;

      if (isLogin) {
        res = await axios.post("http://localhost:5000/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Login successful!");

        if (res.data.user.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/student-dashboard");
        }

      } else {
        // ------------------- SIGNUP -------------------
        if (formData.password !== formData.confirmPassword) {
          setMessage("Passwords do not match!");
          setLoading(false);
          return;
        }

        if (formData.phone.length !== 11) {
          setMessage("Phone number must be exactly 11 digits!");
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setMessage("Password must be at least 8 characters!");
          setLoading(false);
          return;
        }

        if (formData.fullName.length < 3) {
          setMessage("Name must be at least 3 characters!");
          setLoading(false);
          return;
        }

        const registrationData = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role.toLowerCase(),
        };

        console.log("Sending data:", registrationData);

        res = await axios.post(
          "http://localhost:5000/auth/register",
          registrationData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (res.status === 201 || res.data.success) {
          setMessage("Registration successful!");
          setTimeout(() => {
            setIsLogin(true); // switch to login form
          }, 1500);
        } else {
          setMessage(res.data.message || "Registration failed");
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        `Error ${err.response?.status || ""}: ${err.message}`;
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-8">
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
                  placeholder="Full Name (min 3 characters)"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mb-4"
                  minLength={3}
                  required={!isLogin}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (11 digits)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mb-4"
                  pattern="[0-9]{11}"
                  maxLength={11}
                  required={!isLogin}
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mb-4"
                >
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
                {/* Gender temporarily disabled  */}
                {/* <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mb-4"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select> */}
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
              placeholder="Password (min 8 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              minLength={8}
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
                  required={!isLogin}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 cursor-pointer text-white py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
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

          {message && (
            <p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;