import { RefObject } from "preact";
import { useLayoutEffect } from "preact/hooks";

export function useRescale(aRef: RefObject<HTMLDivElement>, scale: number) {
    useLayoutEffect(() => {
        function updateSize() {
            const root = document.body.getBoundingClientRect();
            if (aRef.current) {
                aRef.current.style.transform = "";
                const el = aRef.current.getBoundingClientRect();
                aRef.current.style.transform = `scale(${(root.height / el.height) * scale})`;
            }
        }

        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);
}
