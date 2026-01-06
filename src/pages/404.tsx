import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Page404() {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  return (
    <div className="text-white w-full flex-col min-h-screen flex items-center justify-center text-center text-[20vw] animate-pulse flex-nowrap!">
      404
      <span className="text-[5vw] block mt-4 text-white/70 animate-pulse uppercase">
        REDIRECTING IN {countdown}
      </span>
    </div>
  );
}
