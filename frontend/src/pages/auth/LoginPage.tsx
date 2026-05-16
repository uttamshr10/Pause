import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);

      // store tokens
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", form.username);

      // redirect
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-purple-50">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center p-12 relative bg-gradient-to-br from-purple-50 via-white to-white">

        <h1 className="absolute top-8 left-12 text-xl font-semibold text-slate-700 tracking-tight">
          Pause
        </h1>

        <h2 className="text-5xl font-extrabold text-gray-700 leading-tight mb-6">
          Understand
          <br />
          Monitor.
          <br />
          <span className="text-purple-600 font-extrabold">Improve.</span>
        </h2>

        <p className="text-gray-700 text-lg max-w-md">
          Your personal wellness companion to detect burnout early,
          track your well-being, and build a healthier you.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100 px-6">

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">

          <h2 className="text-3xl font-bold text-gray-700 mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6 text-sm">
            Login to continue to your account
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-purple-600 to-purple-500 text-white py-3 rounded-xl hover:opacity-90 transition shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-600">
              Sign up
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;