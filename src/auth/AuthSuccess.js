import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    // Notify opener window
    if (window.opener) {
      window.opener.postMessage("googlefit_connected", "http://localhost:3000");
    }

    // Close popup
    window.close();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h3>Google Fit connected ✅</h3>
    </div>
  );
}
