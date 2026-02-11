import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";

export default function SignIn() {
  // onsignin success redirect to /dashboard
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Brand */}
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold fs-4 text-primary-color">Login</h5>
                <div className="topbar-left  pb-4 rounded-4">
                  <div className="logo-pill">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="logo-text">BioTrack</span>
                </div>
              </div>

              <hr />

              <p className="auth-subtitle">Sign in to continue tracking your health</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </Form.Group>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button className="auth-btn w-100" type="submit" disabled={loading}>
                    {loading ? ">Signing In…" : "Sign In"}
                  </Button>
                </motion.div>
              </Form>

              <div className="auth-footer">
                Don’t have an account? <Link to="/signup">Sign up</Link>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
