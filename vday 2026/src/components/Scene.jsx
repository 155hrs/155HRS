import { Canvas } from "@react-three/fiber";
import Envelope from "./Envelope";
import PaperSlip from "./PaperSlip";

/**
 * Scene — full-screen R3F canvas.
 *
 * Props:
 *  - envelopeOpen    : boolean — flap is open
 *  - envelopeVisible : boolean — envelope is visible
 *  - isEmpty         : boolean — dims envelope when all slips drawn
 *  - slipData        : { sentence, key } | null
 *  - slipPhase       : "hidden" | "sliding" | "center"
 */
export default function Scene({
    envelopeOpen,
    envelopeVisible,
    isEmpty,
    slipData,
    slipPhase,
    homeInteractionDone,
    onEnvelopeClick,
}) {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 40 }}
            style={{ position: "absolute", top: 0, left: 0 }}
            gl={{ antialias: true }}
        >
            {/* ── Lighting ── */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 5]} intensity={0.6} />
            <directionalLight position={[-2, 1, 3]} intensity={0.3} />

            {/* ── Envelope ── */}
            <Envelope
                open={envelopeOpen}
                visible={envelopeVisible}
                isEmpty={isEmpty}
                homeInteractionDone={homeInteractionDone}
                onEnvelopeClick={onEnvelopeClick}
            />


            {/* ── Paper Slip ── */}
            {slipData && (
                <PaperSlip
                    sentence={slipData.sentence}
                    phase={slipPhase}
                    triggerKey={slipData.key}
                />
            )}
        </Canvas>
    );
}
