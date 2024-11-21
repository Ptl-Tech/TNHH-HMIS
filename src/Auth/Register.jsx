import { Button, Card, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../actions/userActions";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error: registerError, } = useSelector((state) => state.userRegister);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (success) {
      navigate("/login");
    } else if (registerError) {
      message.error(registerError, 5);
    }
  }, [success, registerError, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !role) {
      setError("Please fill in all required fields.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      dispatch(register({ email, password, role, fname, lname }));
    }
  };

  return (
    <div className="register-container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-4 mt-5">
          <Card>
            <h3 className="text-center text-muted">Create an Account</h3>
            <p className="text-center text-muted">
              Sign up to access your account
            </p>
            <form onSubmit={handleRegister}>
            <div className="text-start">
                <label htmlFor="email" className="form-label">
                  Firstname: <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    name="fname"
                    id="fname"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                </div>
              </div>
              <div className="text-start">
                <label htmlFor="email" className="form-label">
                  LastName: <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    name="lname"
                    id="lname"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                </div>
              </div>
              <div className="text-start">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                </div>
              </div>
              <div className="pt-3 text-start">
                <label htmlFor="role" className="form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                </select>
              </div>
              <div className="pt-3 text-start">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                    className="input-group-text"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="pt-3 text-start">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                    className="input-group-text"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <div className="pt-3">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Register
                </Button>
              </div>
            </form>
            <p className="text-muted pt-3">
              Already have an account?{" "}
              <a href="/login" className="text-primary">Login</a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
