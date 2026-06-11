import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
        const result = await registerUser({
        fullName,
        email,
        password,
        });

        setMessage(result);

        setTimeout(() => {
        navigate("/login");
        }, 1200);

    } catch (err) {
        setError(
        err.response?.data ||
        "Registration failed. Please try again."
        );
    }
    };

    return (
    <div style={styles.page}>
        <div style={styles.card}>
        <div style={styles.left}>
            <div style={styles.badge}>🍽️ Join FoodieAI</div>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>
            Start discovering personalized restaurant recommendations around Ankara.
            </p>

            <div style={styles.foodGrid}>
            <div style={styles.foodBox}>🥙</div>
            <div style={styles.foodBox}>🍝</div>
            <div style={styles.foodBox}>🍰</div>
            <div style={styles.foodBox}>☕</div>
            </div>
        </div>

        <div style={styles.right}>
            <h2 style={styles.formTitle}>Sign Up</h2>
            <p style={styles.formText}>Create your account to continue.</p>

        <form onSubmit={handleRegister}>
            <input
            type="text"
            placeholder="Full name"
            style={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            />
            <input
            type="email"
            placeholder="Email address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <input
            type="password"
            placeholder="Confirm password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.button}>
                Register
            </button>
        </form>

            <p style={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
                Login
            </Link>
            </p>
        </div>
        </div>
    </div>
    );
}

const styles = {
    page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FAF7F2 0%, #FFE4D6 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    },
    card: {
    width: "900px",
    minHeight: "540px",
    background: "#fff",
    borderRadius: "28px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    overflow: "hidden",
    },
    left: {
    background: "linear-gradient(160deg, #FF6B35 0%, #FF9F1C 100%)",
    color: "white",
    padding: "55px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    },
    badge: {
    background: "rgba(255,255,255,0.22)",
    padding: "8px 14px",
    borderRadius: "999px",
    width: "fit-content",
    fontSize: "14px",
    marginBottom: "22px",
    },
    title: {
    fontSize: "44px",
    margin: "0 0 14px",
    },
    subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    },
    foodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginTop: "40px",
    },
    foodBox: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: "18px",
    height: "70px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "34px",
    },
    right: {
    padding: "55px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    },
    formTitle: {
    fontSize: "34px",
    marginBottom: "8px",
    color: "#222",
    },
    formText: {
    color: "#777",
    marginBottom: "28px",
    },
    input: {
    width: "100%",
    padding: "15px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    },
    button: {
    width: "100%",
    padding: "15px",
    background: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
    },
    loginText: {
    marginTop: "22px",
    textAlign: "center",
    color: "#666",
    },
    link: {
    color: "#FF6B35",
    fontWeight: "bold",
    textDecoration: "none",
    },
    success: {
    background: "#E8F8EF",
    color: "#1E8E3E",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "12px",
    },

    error: {
    background: "#FDECEC",
    color: "#D93025",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "12px",
    },
};

export default Register;