import { Button } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const letters = [
    "c",
    "h",
    "i",
    "r",
    "o",
    "m",
    "o",
    "e",
    "l",
    "a",
    "n",
    "e",
    "4",
    "0",
    "4",
    "y",
    "m",
    "e",
    "d",
    "i",
    "c",
    "a",
    "l",
    "y",
    "c",
    "e",
    "p",
    "a",
    "g",
    "e",
    "v",
    "j",
    "a",
    "n",
    "o",
    "t",
    "s",
    "c",
    "e",
    "w",
    "c",
    "e",
    "n",
    "t",
    "r",
    "e",
    "h",
    "q",
    "e",
    "f",
    "o",
    "u",
    "n",
    "d",
    "s",
    "w",
    "q",
    "v",
    "o",
    "s",
    "m",
    "v",
    "f",
    "u",
  ];

  const notFoundIndexes = [
    12, 13, 14, 26, 27, 28, 29, 33, 34, 35, 49, 50, 51, 52, 53,
  ];

  const [highlightedIndexes, setHighlightedIndexes] = useState([]);

  useEffect(() => {
    notFoundIndexes.forEach((index, i) => {
      setTimeout(() => {
        setHighlightedIndexes((prev) => [...prev, index]);
      }, i * 500); // 500ms interval
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#335B67",
        background:
          "radial-gradient(ellipse at center,  #335B67 0%, #2C3E50 100%) fixed no-repeat",
      }}
    >
      <div
        id="wrap"
        className="container"
        style={{
          color: "#fff",
          display: "grid",
          fontWeight: "300",
          alignItems: "center",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        <div id="wordsearch">
          <ul
            style={{
              gap: "2px",
              display: "grid",
              listStyle: "none",
              gridTemplateRows: "repeat(8, 56px)",
              gridTemplateColumns: "repeat(8, 56px)",
            }}
          >
            {letters.map((letter, index) => (
              <li
                key={letter + index}
                style={{
                  display: "flex",
                  fontSize: "16px",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: highlightedIndexes.includes(index)
                    ? "rgba(26,188,156,0.7)"
                    : "rgba(0,0,0,.2)",
                  color: "#fff",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                {letter.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
        <div
          id="main-content"
          style={{ display: "grid", gap: "32px", maxWidth: "480px" }}
        >
          <h1 style={{ fontWeight: "200" }}>
            We couldn't find what you were looking for.
          </h1>
          <div className="">
            <p>
              Unfortunately the page you were looking for could not be found. It
              may be temporarily unavailable, moved or no longer exist.
            </p>
            <p>
              Check the URL you entered for any mistakes and try again.
              Alternatively, click on one of these links to be taken to a link
              we are sure will work.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              type="outlined"
              class="navigation"
              onClick={() => window.history.back()}
              style={{ borderRadius: 0, color: "white", borderColor: "white" }}
            >
              Go back
            </Button>
            <Button
              type="outlined"
              class="navigation"
              onClick={() => navigate("/Dashboard")}
              style={{ borderRadius: 0, color: "white", borderColor: "white" }}
            >
              Dashboard
            </Button>
            <Button
              type="outlined"
              class="navigation"
              onClick={() => navigate("/login")}
              style={{ borderRadius: 0, color: "white", borderColor: "white" }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
