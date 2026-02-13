import { useState, useCallback } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import Scene from "./components/Scene";
import useSlipStore from "./hooks/useSlipStore";
import slipBgUrl from "./assets/slip_bg.png";
import logoUrl from "./assets/vdaylogo.png";
import "./App.css";

// Preload the slip background to prevent glitch on first draw
useLoader.preload(THREE.ImageLoader, slipBgUrl);

/**
 * App — top-level layout.
 *
 * Animation flow when "draw a slip" is clicked:
 *  1. Envelope flap opens                           (~500 ms)
 *  2. Paper slip slides up out of envelope           (~1000 ms)
 *  3. Envelope fades away                            (~1000 ms, overlaps step 2)
 *  4. Slip glides to screen center                   (~1400 ms)
 *  5. Sentence revealed in DOM overlay
 *
 * On subsequent draws the envelope reappears (closed), then repeats.
 * When empty, envelope stays visible but dimmed.
 */
export default function App() {
  const { drawSlip, isEmpty, drawnCount, total } = useSlipStore();

  const [slipData, setSlipData] = useState(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeVisible, setEnvelopeVisible] = useState(true);
  const [slipPhase, setSlipPhase] = useState("hidden");
  const [drawing, setDrawing] = useState(false);
  const [displayedSentence, setDisplayedSentence] = useState(null);
  const [homeInteractionDone, setHomeInteractionDone] = useState(false);

  const handleDraw = useCallback(() => {
    if (isEmpty || drawing) return;

    // First time? Trigger the reveal! (Texture slide-up + flip)
    // We don't call initiateDraw() here; user must click again.
    if (!homeInteractionDone) {
      setHomeInteractionDone(true);
      return;
    }

    initiateDraw();


    function initiateDraw() {
      const sentence = drawSlip();
      if (!sentence) return;

      setDrawing(true);
      setDisplayedSentence(null);

      // If this is a subsequent draw, reset: bring envelope back first.
      if (slipData) {
        // Hide current slip quickly
        setSlipPhase("hidden");

        // Show envelope (closed) after old slip fades
        setTimeout(() => {
          setEnvelopeVisible(true);
          setEnvelopeOpen(false);

          // Now set new slip data while hidden
          setSlipData({ sentence, key: Date.now() });

          // Small pause then start the opening sequence
          setTimeout(() => {
            startOpenSequence(sentence);
          }, 350);
        }, 300);
      } else {
        // First draw — envelope is already visible and closed
        setSlipData({ sentence, key: Date.now() });
        startOpenSequence(sentence);
      }
    }

    function startOpenSequence(sentence) {
      // ── Phase 1: Open the flap (~500 ms) ──
      setEnvelopeOpen(true);

      // ── Phase 2: Slip slides up out of envelope ──
      setTimeout(() => {
        setSlipPhase("sliding");
      }, 500);

      // ── Phase 3: Envelope fades away ──
      setTimeout(() => {
        setEnvelopeVisible(false);
      }, 1000);

      // ── Phase 4: Slip glides to center ──
      setTimeout(() => {
        setSlipPhase("center");
      }, 1400);

      // ── Phase 5: Reveal sentence in DOM ──
      setTimeout(() => {
        setDisplayedSentence(sentence);
        setDrawing(false);
        // Reset envelope state for next draw
        setEnvelopeOpen(false);
      }, 2500);
    }
  }, [isEmpty, drawing, drawSlip, slipData, homeInteractionDone]);

  const handleReset = useCallback(() => {
    setHomeInteractionDone(false);
    setSlipData(null);
    setDisplayedSentence(null);
    setSlipPhase("hidden");
    setEnvelopeVisible(true);
    setEnvelopeOpen(false);
    setDrawing(false);
  }, []);

  return (
    <div className="app">
      {/* ── Main Logo ── */}
      <img
        src={logoUrl}
        className="main-logo"
        alt="VDay 2026 Logo"
        onClick={handleReset}
      />

      {/* ── 3D Canvas ── */}
      <Scene
        envelopeOpen={envelopeOpen}
        envelopeVisible={envelopeVisible}
        isEmpty={isEmpty}
        slipData={slipData}
        slipPhase={slipPhase}
        homeInteractionDone={homeInteractionDone}
        onEnvelopeClick={handleDraw}
      />


      {/* ── UI Overlay ── */}
      <div className="ui-overlay">


        {/* Buttons */}
        <div className="button-group">

          {/* Read Letter button */}
          <button
            className="draw-button"
            onClick={() => alert("Letter coming soon...")}
          >
            read letter
          </button>


          {/* Draw button */}
          <button
            className={`draw-button ${isEmpty ? "empty" : ""} ${drawing ? "drawing" : ""}`}
            onClick={handleDraw}
            disabled={isEmpty || drawing}
          >
            {isEmpty ? "the box is empty" : drawing ? "..." : "draw a slip"}
          </button>
        </div>

        {/* Counter */}
        <p className="counter">
          {isEmpty
            ? "all 100 slips drawn ♡"
            : `${total - drawnCount} remaining`}
        </p>
      </div>
    </div>
  );
}
