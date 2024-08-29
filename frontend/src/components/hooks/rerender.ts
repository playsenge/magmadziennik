import { useState } from "react";

export const useRerender = (): (() => void) => {
    const [, setCounter] = useState(0);

    return () => setCounter(prevCounter => prevCounter + 1);
};