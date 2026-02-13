import { useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import slipBgUrl from "../assets/slip_bg.png";

/**
 * Creates an off-screen canvas texture with the given sentence and background image.
 */
function createSlipTexture(sentence, bgImage) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // ── Background Image ──
    ctx.clearRect(0, 0, 1024, 512); // Ensure transparent start
    if (bgImage) {
        ctx.drawImage(bgImage, 0, 0, 1024, 512);
    }
    // No fallback - if image fails, slip is transparent/invisible vs showing unwanted color


    // ── Sentence text ──
    ctx.fillStyle = "#2e2a25";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Use Helvetica (system font).
    ctx.font = '36px "Helvetica Neue", Helvetica, Arial, sans-serif';

    // Word-wrap to fit the canvas width with padding.
    const maxWidth = 880;
    const lineHeight = 50;
    const words = sentence.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i];
        if (ctx.measureText(testLine).width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    // Center block vertically.
    const startY = 256 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
        ctx.fillText(line, 512, startY + i * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * PaperSlip — slides up from inside the envelope, then the envelope
 * fades away and the slip arrives at screen center.
 *
 * Animation phases (controlled by `phase` prop):
 *  "hidden"  → opacity 0, positioned inside envelope
 *  "sliding" → slides upward out of envelope, becomes visible
 *  "center"  → arrives at screen center (y=0), full opacity
 *
 * Props:
 *  - sentence  : string
 *  - phase     : "hidden" | "sliding" | "center"
 *  - triggerKey : unique key per draw
 */
export default function PaperSlip({ sentence, phase, triggerKey }) {
    const bgImage = useLoader(THREE.ImageLoader, slipBgUrl);
    const texture = useMemo(() => createSlipTexture(sentence, bgImage), [sentence, bgImage]);

    // ── Position + opacity spring ──
    // hidden  : inside envelope (y = -0.35, z = 0.2)
    // sliding : poking out above envelope (y = 0.9, z = 0.2)
    // center  : screen center (y = 0.05, z = 1.5)
    const targetY = phase === "hidden" ? -0.35 : phase === "sliding" ? 0.9 : 0.05;
    const targetZ = phase === "hidden" ? 0.2 : phase === "sliding" ? 0.2 : 1.5;
    const targetOpacity = phase === "hidden" ? 0 : 1;

    const { posY, posZ, opacity } = useSpring({
        posY: targetY,
        posZ: targetZ,
        opacity: targetOpacity,
        config:
            phase === "sliding"
                ? { tension: 70, friction: 26, clamp: true }  // Slide up: smoother, slower
                : phase === "center"
                    ? { tension: 50, friction: 20, clamp: true }    // Glide to center: very gentle
                    : { duration: 100 },                            // Hidden: quick reset
    });

    return (
        <animated.mesh
            position-x={0}
            position-y={posY}
            position-z={posZ}
        >
            <planeGeometry args={[1.4, 0.7]} />
            <animated.meshBasicMaterial
                map={texture}
                transparent
                opacity={opacity}
                side={THREE.DoubleSide}
                depthWrite={false}
                toneMapped={false} // Ensure colors are not altered by tone mapping
            />
        </animated.mesh>
    );
}
