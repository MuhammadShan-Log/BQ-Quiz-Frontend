import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../utils/api";
import { useEffect, useState } from "react";

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
  const [availableCourses, setAvailableCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const fetchAvailableCourses = async () => {
    try {
      const res = await api.get("/course/list");
      setAvailableCourses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

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
        res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Login successful!");

        const userRole = res.data.user.role;
        if (userRole === "admin") {
          navigate("/dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher/dashboard");
        } else if (userRole === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
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

        if (formData.role === "student") {
          if (
            !formData.enrollmentCourseID ||
            formData.enrollmentCourseID.trim() === ""
          ) {
            setMessage("Enrollment Course ID is required!");
            setLoading(false);
            return;
          }
        }

        const registrationData = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          enrollmentCourseID: formData.enrollmentCourseID || "",
          password: formData.password,
          role: formData.role.toLowerCase(),
        };

        res = await api.post("/auth/register", registrationData);

        if (res.status === 201 || res.data.success) {
          setMessage("Registration successful!");
          setTimeout(() => {
            setIsLogin(true);
          }, 1000);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-blue-50 to-green-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full shadow-md mb-4">
            <img
              src="/public/logo.png"
              alt="Logo"
              className="h-20 w-auto transition-transform hover:scale-105"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            BQ Quiz Portal
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Empowering Your Learning Journey
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-8">
          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isLogin ? "Welcome Back" : "Join the Journey"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin
                ? "Sign in to access your account"
                : "Create an account to start learning"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="relative flex mb-8 bg-gray-100 rounded-xl p-1 shadow-inner">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
                isLogin ? "left-1" : "left-[calc(50%-2px)]"
              }`}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative w-1/2 py-3 rounded-lg transition-all duration-300 ease-in-out z-10 font-medium ${
                isLogin ? "text-white" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative w-1/2 py-3 rounded-lg transition-all duration-300 ease-in-out z-10 font-medium ${
                !isLogin ? "text-white" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name (min 3 characters)"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                    minLength={3}
                    required
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (11 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    required
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>

                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none transition-all duration-200"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                required
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>

            {!isLogin && formData.role === "student" && (
              <div className="relative">
                <select
                  name="enrollmentCourseID"
                  value={formData.enrollmentCourseID}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 appearance-none transition-all duration-200"
                  required
                >
                  <option value="">Select a course</option>
                  {availableCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {!isLogin && (
              <>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="profilePicture"
                  >
                    Profile Picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all duration-200"
                    >
                      <div className="text-center">
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-teal-600 hover:text-teal-700">
                            Upload Image
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-green-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg text-center text-sm font-medium ${
                message.includes("successful")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2025 BQ Quiz Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
