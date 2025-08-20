import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../utils/api";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Login successful!");

        // if (res.data.user.role === "teacher") {
        //   navigate("/teacher-dashboard");
        // } else {
        // }
        navigate("/dashboard");
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

        res = await api.post(
          "/auth/register",
          registrationData
        );

        if (res.status === 201 || res.data.success) {
          setMessage("Registration successful!");
          setTimeout(() => {
            setIsLogin(true); // switch to login form
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
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-8">

      <div className="rounded-lg w-full max-w-sm  overflow-hidden">
        <div className="bq-logo" style={{ background: 'transparent', marginBottom: '20px' }}>
          <img src="/public/logo.png" alt="Logo" style={{ height: '150px' }} />
        </div>

        <div className="bg-white">
          <div className="bg-teal-500 text-white text-center py-4">

            <h2 className="text-3xl font-extrabold font-Montserrat pb-1">
              Quiz Portal
            </h2>
            <p className="text-md font-Montserrat">
              {isLogin
                ? "Create your account to get started"
                : "Create your account to get started"}
            </p>
          </div>
          <div className="p-6">
            <div className="relative flex mb-6 bg-gray-100 rounded-lg p-1">
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-teal-500 rounded-md shadow-sm transition-all duration-300 ease-in-out ${isLogin ? "left-1" : "left-[calc(50%-2px)]"
                  }`}
              />
              <button
                onClick={() => setIsLogin(true)}
                className={`relative w-1/2 py-2 rounded-md transition-all duration-300 ease-in-out z-10 ${isLogin ? "text-white font-medium" : "text-gray-600"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative w-1/2 py-2 rounded-md transition-all duration-300 ease-in-out z-10 ${!isLogin ? "text-white font-medium" : "text-gray-600"
                  }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="transition-all duration-500 ease-in-out">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name (min 3 characters)"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-teal-500"
                    minLength={3}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (11 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-teal-500"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    required
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-teal-500"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2  border-gray-300 outline-none focus:border-teal-500"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2  border-gray-300 outline-none focus:border-teal-500 pr-10"
                  minLength={8}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </span>
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
                      className="w-full border rounded-lg px-3 py-2 border-gray-300 outline-none focus:border-teal-500 pr-10"
                      required
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </span>
                  </div>
                  <div className="mt-6">
                    <label
                      className="block mb-1 text-gray-700 font-medium"
                      htmlFor="profilePicture"
                    >
                      Upload Profile Picture
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-700 mb-4 cursor-pointer border border-gray-300 p-2 rounded-lg focus:border-teal-500 outline-none"
                    />
                  </div>
                </>
              )}

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
              <p
                className={`mt-4 text-center text-sm ${message.includes("successful")
                    ? "text-green-500"
                    : "text-red-500"
                  }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
