import { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";

/**
 * 3D Box — centered in the scene.
 *
 * Props:
 *  - visible : boolean — controls fade in/out (true = opaque, false = transparent)
 *  - isEmpty : boolean — visually dims the box when all slips are drawn
 *
 * The box crossfades in/out over ~600 ms. When all slips are drawn it
 * reappears in a dimmed state with dashed-feeling lower opacity.
 */
export default function Box({ visible, isEmpty }) {
    const meshRef = useRef();

    // ── Fade animation (~600 ms) ──
    const { opacity } = useSpring({
        opacity: visible ? (isEmpty ? 0.3 : 0.55) : 0,
        config: { duration: 600 },
    });

    const baseColor = isEmpty ? "#c8c4bf" : "#e8e3dc";

    return (
        <animated.mesh ref={meshRef} position={[0, 0, 0]}>
            {/* Box geometry — slightly wider than tall */}
            <boxGeometry args={[1.4, 1.0, 1.0]} />

            {/* Matte, translucent surface */}
            <animated.meshStandardMaterial
                color={baseColor}
                transparent
                opacity={opacity}
                roughness={0.9}
                metalness={0.0}
                depthWrite={false}
            />
        </animated.mesh>
    );
}
