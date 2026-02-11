import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./auth.css";

export default function SignUp() {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
    } catch (err) {
      alert(err?.response?.data?.error || "Signup failed");
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
                <h5 className="fw-bold fs-5 text-primary-color">Create Account</h5>
                <div className="topbar-left pb-4 rounded-4">
                  <div className="logo-pill">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="logo-text">BioTrack</span>
                </div>
              </div>

              <hr />

              <p className="auth-subtitle">Start your journey towards better health</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </Form.Group>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button className="auth-btn w-100" type="submit" disabled={loading}>
                    {loading ? "Creating account…" : "Create Account"}
                  </Button>
                </motion.div>
              </Form>

              <div className="auth-footer">
                Already have an account? <Link to="/signin">Sign in</Link>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
