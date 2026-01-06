import { useEffect, useState } from "react";

export default function Page404() {
        const [countdown, setCountdown] = useState(3);
        useEffect(() => {
            if (countdown <= 0) {
                document.location.href = "/";
                return;
            }
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }, [countdown]);
    return (
        <div className="text-white w-full flex-col min-h-screen flex items-center justify-center text-center text-[20vw] animate-pulse flex-nowrap!">
            404
            <span className="text-[5vw] block mt-4 text-white/70 animate-pulse uppercase">
                REDIRECTING IN {countdown}
            </span>
        </div>
    );
}