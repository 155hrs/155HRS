import { useState, useCallback } from "react";
import sentences from "../data/sentences";

/**
 * Fisher-Yates shuffle (in-place).
 */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Manages the pool of remaining sentences.
 *
 * - `remaining` : array of sentence strings not yet drawn
 * - `drawSlip()`: pops one sentence and returns it (or null if empty)
 * - `isEmpty`   : true when all 100 have been used
 * - `drawnCount`: how many slips have been pulled so far
 */
export default function useSlipStore() {
    const [remaining, setRemaining] = useState(() => shuffle(sentences));

    const isEmpty = remaining.length === 0;
    const drawnCount = sentences.length - remaining.length;

    const drawSlip = useCallback(() => {
        if (remaining.length === 0) return null;

        // Pop the last element (O(1)) from the pre-shuffled pool.
        const sentence = remaining[remaining.length - 1];
        setRemaining((prev) => prev.slice(0, -1));
        return sentence;
    }, [remaining]);

    return { drawSlip, isEmpty, drawnCount, total: sentences.length };
}
