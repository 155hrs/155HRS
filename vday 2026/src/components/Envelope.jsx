import { useRef, useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import slipBgUrl from "../assets/texture.png";

/**
 * Envelope — a flat 2.5D envelope shape with an openable flap.
 *
 * Built from three planes:
 *  1. Body  — rectangular main face
 *  2. Flap  — triangular top that rotates open
 *  3. Back  — slightly behind the body for depth
 *
 * Props:
 *  - open                : boolean — flap rotates open when true
 *  - visible             : boolean — fades the entire envelope in/out
 *  - isEmpty             : boolean — dims the envelope when empty
 *  - homeInteractionDone : boolean — true when user has clicked to start
 *  - onEnvelopeClick     : function — callback for clicking the envelope
 */
export default function Envelope({ open, visible, isEmpty, homeInteractionDone, onEnvelopeClick }) {
    const groupRef = useRef();
    const { viewport, size } = useThree();
    const bgTexture = useLoader(THREE.TextureLoader, slipBgUrl);

    // ── Calculate precision scale (100px increase) ──
    const pixelToUnit = viewport.width / size.width;
    const baseWidthUnits = 1.5;
    const targetWidthUnits = baseWidthUnits + (100 * pixelToUnit);
    const baseScale = targetWidthUnits / baseWidthUnits;


    // ── Flap rotation spring (~500 ms) ──
    // Open = 0 (upright), Closed = pi (folded down over body)
    const { flapAngle } = useSpring({
        flapAngle: open ? 0 : Math.PI - 0.05,
        config: { tension: 60, friction: 20, clamp: true },
    });

    // ── Envelope opacity spring (~500 ms) ──
    const { opacity } = useSpring({
        opacity: visible ? (isEmpty ? 0.35 : 0.85) : 0,
        config: { duration: 500 },
    });

    // ── Home Reveal spring (slide up + fade + FLIP) ──
    const { overlayY, overlayOpacity, rotationY } = useSpring({
        overlayY: homeInteractionDone ? 0.8 : 0,
        overlayOpacity: homeInteractionDone ? 0 : 0.5,
        rotationY: homeInteractionDone ? 0 : Math.PI, // Start showing back (PI), flip to front (0)
        config: (key) => {
            if (key === "rotationY") return { tension: 40, friction: 20 }; // Slower flip
            return { mass: 1, tension: 70, friction: 26 };
        },
        delay: (key) => (key === "rotationY" ? 300 : 0), // Start flip slightly after texture starts moving
    });

    // ── Envelope colors ──
    const bodyColor = isEmpty ? "#d4cfc9" : "#2B3C51";
    const flapColor = isEmpty ? "#c8c3bd" : "#1E2B3B";
    const innerColor = "#f0e8dc";
    const backSideColor = bodyColor; // The back is the same color as the front body

    // ── Triangular flap geometry ──
    const flapGeometry = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.75, 0);   // bottom-left
        shape.lineTo(0.75, 0);    // bottom-right
        shape.lineTo(0, 0.55);    // top-center (apex)
        shape.closePath();
        return new THREE.ShapeGeometry(shape);
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        if (onEnvelopeClick) onEnvelopeClick();
    };

    return (
        <animated.group
            ref={groupRef}
            position={[0, 0, 0]}
            scale={baseScale}
            rotation-y={rotationY}
            onClick={handleClick}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
        >
            {/* ── Home Screen Overlay (appears on the BACK side) ── */}
            {overlayOpacity.to(o => o > 0) && (
                <animated.mesh
                    position-y={overlayY}
                    position-z={-0.012} // Slightly behind the back-face mesh
                    rotation-y={Math.PI} // Match the back-face orientation
                >
                    <planeGeometry args={[1.5, 1.0]} />
                    <animated.meshBasicMaterial
                        map={bgTexture}
                        transparent
                        opacity={overlayOpacity}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </animated.mesh>
            )}

            {/* ── Envelope body (front face) ── */}
            <animated.mesh position={[0, 0, 0.005]}>
                <planeGeometry args={[1.5, 1.0]} />
                <animated.meshStandardMaterial
                    color={bodyColor}
                    transparent
                    opacity={opacity}
                    roughness={0.85}
                    metalness={0}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </animated.mesh>

            {/* ── Envelope BACK face (visible initially) ── */}
            <animated.mesh position={[0, 0, -0.005]}>
                <planeGeometry args={[1.5, 1.0]} />
                <animated.meshStandardMaterial
                    color={backSideColor}
                    transparent
                    opacity={opacity}
                    roughness={0.85}
                    metalness={0}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </animated.mesh>

            {/* ── Envelope inner face ── */}
            <animated.mesh position={[0, 0, 0]}>
                <planeGeometry args={[1.5, 1.0]} />
                <animated.meshStandardMaterial
                    color={innerColor}
                    transparent
                    opacity={opacity}
                    roughness={0.9}
                    metalness={0}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </animated.mesh>


            {/* ── Flap (pivots from top edge of body) ── */}
            <group position={[0, 0.5, 0.005]}>
                <animated.group rotation-x={flapAngle}>
                    <animated.mesh>
                        <primitive object={flapGeometry} attach="geometry" />
                        <animated.meshStandardMaterial
                            color={flapColor}
                            transparent
                            opacity={opacity}
                            roughness={0.85}
                            metalness={0}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </animated.mesh>
                </animated.group>
            </group>


        </animated.group>
    );
}

