"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scene3D } from "./Scene3D";
import {
  APOLOGY_DIALOGUE,
  FINAL_MESSAGE,
  HER_NAME,
  HIS_NAME,
} from "@/lib/dialogue";

type Phase = "intro" | "dialogue" | "final" | "complete";

type ApologyOverlayProps = {
  onManTalkingChange: (talking: boolean) => void;
  onShowHeartsChange: (show: boolean) => void;
  onHuggingChange: (hugging: boolean) => void;
};

function ApologyOverlay({
  onManTalkingChange,
  onShowHeartsChange,
  onHuggingChange,
}: ApologyOverlayProps) {
  const [phase, setPhase] = useState<Phase>("intro");

  const [stepIndex, setStepIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [sending, setSending] = useState(false);

  const [manTalkingUi, setManTalkingUi] = useState(false);

  // NEW INTRO STATES
  const [introOpen, setIntroOpen] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);

  const currentStep = APOLOGY_DIALOGUE[stepIndex];

  const isLastStep = stepIndex >= APOLOGY_DIALOGUE.length - 1;

  useEffect(() => {
    onShowHeartsChange(phase === "final" || phase === "complete");
  }, [phase, onShowHeartsChange]);

  // ============================================
  // START EXPERIENCE
  // ============================================

  const startDialogue = () => {
    setIntroOpen(true);

    setTimeout(() => {
      setHideIntro(true);

      setPhase("dialogue");
      setStepIndex(0);
      setShowResponse(false);
      setTypingDone(false);
      setDisplayedText("");

      onManTalkingChange(true);
      setManTalkingUi(true);
    }, 1000);
  };

  // ============================================
  // TYPING EFFECT
  // ============================================

  const typeMessage = useCallback(
    (text: string) => {
      setDisplayedText("");
      setTypingDone(false);

      onManTalkingChange(true);
      setManTalkingUi(true);

      let i = 0;

      const interval = setInterval(() => {
        i++;

        setDisplayedText(text.slice(0, i));

        if (i >= text.length) {
          clearInterval(interval);

          setTypingDone(true);

          onManTalkingChange(false);
          setManTalkingUi(false);

          setShowResponse(true);
        }
      }, 28);

      return () => clearInterval(interval);
    },
    [onManTalkingChange],
  );

  useEffect(() => {
    if (phase !== "dialogue") return;

    const step = APOLOGY_DIALOGUE[stepIndex];

    if (!step) return;

    return typeMessage(step.manMessage);
  }, [phase, stepIndex, typeMessage]);

  // ============================================
  // SEND NOTIFICATION
  // ============================================

  const sendNotification = async (
    decision: "accept" | "reject",
    label: string,
  ) => {
    const step = APOLOGY_DIALOGUE[stepIndex];

    if (!step) return;

    setSending(true);

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          stepId: step.id,
          message: label,
          decision,
          stepText: step.manMessage,
        }),
      });
    } catch {
      //
    } finally {
      setSending(false);
    }
  };

  // ============================================
  // HANDLE RESPONSE
  // ============================================

  const handleResponse = async (decision: "accept" | "reject") => {
    const label = decision === "accept" ? "Accept 💚" : "Reject 💔";

    setShowResponse(false);

    await sendNotification(decision, label);

    if (isLastStep) {
      setPhase("final");

      onManTalkingChange(true);
      setManTalkingUi(true);

      setTimeout(() => {
        onManTalkingChange(false);
        setManTalkingUi(false);
      }, 1000);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <>
      {/* BACKGROUND OVERLAY */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-t from-[#0a0612] via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* ========================================= */}
      {/* INTRO SCREEN */}
      {/* ========================================= */}

      <AnimatePresence>
        {!hideIntro && (
          <motion.div
            className="fixed inset-0 z-[999] overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* BACKGROUND GLOW */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            />

            {/* SPLIT OPEN EFFECT */}
            <motion.div
              className="absolute left-0 top-0 z-20 h-full w-1/2 bg-gradient-to-r from-[#170617] to-[#26092b]"
              animate={{
                x: introOpen ? "-100%" : 0,
                rotate: introOpen ? -6 : 0,
              }}
              transition={{
                duration: 2.2,
                ease: [0.83, 0, 0.17, 1],
              }}
            />

            <motion.div
              className="absolute right-0 top-0 z-20 h-full w-1/2 bg-gradient-to-l from-[#170617] to-[#26092b]"
              animate={{
                x: introOpen ? "100%" : 0,
                rotate: introOpen ? 6 : 0,
              }}
              transition={{
                duration: 2.2,
                ease: [0.83, 0, 0.17, 1],
              }}
            />

            {/* HEART CRACK */}
            <motion.div
              className="absolute left-1/2 top-0 z-30 h-full w-[2px] bg-pink-400/50 shadow-[0_0_30px_rgba(255,105,180,0.8)]"
              animate={{
                opacity: introOpen ? 0 : 1,
              }}
            />

            {/* CONTENT */}
            <div className="relative z-40 flex h-full flex-col items-center justify-center px-6 text-center">
              {/* CRY GIF */}
              <motion.img
                src="/gifs/cry.gif"
                alt="cry"
                className="h-40 w-40 object-contain sm:h-52 sm:w-52"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              {/* TITLE */}
              <motion.h1
                className="mt-8 max-w-3xl bg-gradient-to-r from-pink-200 via-rose-200 to-purple-300 bg-clip-text text-4xl font-light leading-tight text-transparent sm:text-6xl"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
              >
                Hey Fairytale...
                <br />
                Bus ek vat sambhadi ja 💔
              </motion.h1>

              {/* TEXT */}
              <motion.p
                className="mt-6 max-w-xl text-base leading-relaxed text-pink-200/70 sm:text-lg"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.7,
                }}
              >
                I know I made mistakes...
                <br />
                but this was made only for you.
              </motion.p>

              {/* BUTTON */}
              <motion.button
                type="button"
                onClick={startDialogue}
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="group relative mt-12 overflow-hidden rounded-full border border-pink-300/20 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-10 py-4 text-lg font-medium text-white shadow-2xl shadow-pink-500/30"
              >
                {/* BUTTON SHINE */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                />

                <span className="relative z-10">Open My Heart 💕</span>
              </motion.button>

              {/* BOTTOM TEXT */}
              <motion.p
                className="mt-8 text-sm tracking-[0.3em] text-pink-200/30"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1,
                }}
              >
                MADE WITH LOVE • FOR {HER_NAME}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}

      <motion.div
        className="relative z-10 flex min-h-screen flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <header className="px-6 pt-6 text-center">
          <motion.h1
            className="bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 bg-clip-text text-2xl font-light tracking-wide text-transparent sm:text-3xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            For {HER_NAME}
          </motion.h1>

          <motion.p
            className="mt-1 text-sm text-pink-200/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            from {HIS_NAME}, with all my heart
          </motion.p>
        </header>

        <motion.div className="flex flex-1 flex-col justify-end gap-4 p-4 pb-8 sm:p-6">
          <AnimatePresence mode="wait">
            {phase === "dialogue" && currentStep && (
              <motion.div
                key={`step-${stepIndex}`}
                className="mx-auto w-full max-w-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="grid gap-4 md:grid-cols-2 md:gap-8"
                  layout
                >
                  {/* MAN SIDE */}
                  <div className="flex flex-col items-start">
                    <span className="mb-1 text-xs font-medium uppercase tracking-widest text-blue-300/80">
                      {HIS_NAME}
                    </span>

                    <motion.div className="relative max-w-md rounded-2xl rounded-bl-sm border border-blue-400/20 bg-blue-950/60 px-5 py-4 shadow-xl backdrop-blur-md">
                      <p className="min-h-[4rem] text-base leading-relaxed text-blue-50 sm:text-lg">
                        {displayedText}

                        {!typingDone && (
                          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-pink-400" />
                        )}
                      </p>

                      {manTalkingUi && (
                        <motion.div
                          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-400"
                          animate={{
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* WOMAN SIDE */}
                  <motion.div className="flex flex-col items-end">
                    <span className="mb-1 text-xs font-medium uppercase tracking-widest text-pink-300/80">
                      {HER_NAME}
                    </span>

                    <motion.div className="min-h-[5rem] max-w-md rounded-2xl rounded-br-sm border border-pink-400/10 bg-pink-950/20 px-5 py-4 backdrop-blur-sm">
                      <p className="text-sm italic text-pink-200/40">
                        {showResponse
                          ? "What do you say?"
                          : typingDone
                            ? "..."
                            : "Listening..."}
                      </p>
                    </motion.div>

                    <AnimatePresence>
                      {showResponse && (
                        <motion.div
                          className="mt-4 flex flex-wrap justify-end gap-3"
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: -10,
                          }}
                        >
                          <button
                            type="button"
                            disabled={sending}
                            onClick={() => handleResponse("accept")}
                            className="rounded-full border border-emerald-400/40 bg-emerald-600/80 px-6 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500 disabled:opacity-50"
                          >
                            Accept 💚
                          </button>

                          <button
                            type="button"
                            disabled={sending}
                            onClick={() => handleResponse("reject")}
                            className="rounded-full border border-rose-400/30 bg-rose-900/60 px-6 py-2.5 font-medium text-rose-100 transition hover:bg-rose-800/80 disabled:opacity-50"
                          >
                            Reject 💔
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* FINAL */}
            {phase === "final" && (
              <motion.div
                key="final"
                className="mx-auto max-w-lg text-center"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >
                <motion.div className="rounded-3xl border border-pink-400/30 bg-gradient-to-br from-pink-950/80 to-purple-950/80 px-8 py-10 shadow-2xl backdrop-blur-xl">
                  <motion.p className="text-3xl font-light leading-snug text-pink-100 sm:text-4xl">
                    {FINAL_MESSAGE}
                  </motion.p>

                  <motion.p className="mt-4 text-sm text-pink-200/60">
                    — {HIS_NAME}
                  </motion.p>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => {
                    setPhase("complete");
                    onHuggingChange(true);
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="group relative mt-10 overflow-hidden rounded-full border border-pink-300/40 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-10 py-4 text-lg font-semibold text-white shadow-[0_0_35px_rgba(255,105,180,0.45)] transition-all duration-300"
                >
                  {/* Animated Shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-120%", "120%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                  />

                  {/* Glow Pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-pink-400/20 blur-xl"
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    Maar mane
                    <motion.span
                      animate={{
                        rotate: [0, 12, -12, 0],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                      }}
                    >
                      ♾️
                    </motion.span>
                  </span>

                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-70" />
                </motion.button>
              </motion.div>
            )}

            {/* COMPLETE */}
            {phase === "complete" && (
              <motion.p
                key="complete"
                className="text-center text-pink-200/50"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                Thank you for being you ❤️
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

export function ApologyExperience() {
  const [manTalking, setManTalking] = useState(false);

  const [showHearts, setShowHearts] = useState(false);

  const [isHugging, setIsHugging] = useState(false);

  const onManTalkingChange = useCallback((talking: boolean) => {
    setManTalking(talking);
  }, []);

  const onShowHeartsChange = useCallback((show: boolean) => {
    setShowHearts(show);
  }, []);

  const onHuggingChange = useCallback((hugging: boolean) => {
    setIsHugging(hugging);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Scene3D
        manTalking={manTalking}
        showHearts={showHearts}
        isHugging={isHugging}
      />

      <ApologyOverlay
        onManTalkingChange={onManTalkingChange}
        onShowHeartsChange={onShowHeartsChange}
        onHuggingChange={onHuggingChange}
      />
    </main>
  );
}
