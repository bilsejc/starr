import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { StarField } from "@/components/cosmos/StarField";
import { StarShape } from "@/components/cosmos/StarShape";
import { AdminPanel } from "@/components/cosmos/AdminPanel";
import { useGameState } from "@/game/useGameState";
import type { StarState } from "@/game/types";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type Phase = "grid" | "selected" | "revealed";

const Index = () => {
  const { sections, stars, markUsed, resetGame, updateSections, sectionById, remaining, allDone } = useGameState();
  const [phase, setPhase] = useState<Phase>("grid");
  const [activeStar, setActiveStar] = useState<StarState | null>(null);

  const fireConfetti = () => {
    const defaults = { spread: 360, ticks: 100, gravity: 0.5, decay: 0.94, startVelocity: 30, shapes: ["star"] as any, colors: ["#fbbf24", "#f59e0b", "#ec4899", "#a855f7", "#22d3ee", "#fde047"] };
    confetti({ ...defaults, particleCount: 80, scalar: 1.2 });
    confetti({ ...defaults, particleCount: 40, scalar: 0.75, shapes: ["circle"] as any });
    setTimeout(() => confetti({ ...defaults, particleCount: 60, origin: { y: 0.4 } }), 250);
  };

  const handleStarClick = (star: StarState) => {
    if (star.used || phase !== "grid") return;
    setActiveStar(star);
    setPhase("selected");
  };

  const handleReveal = () => {
    if (!activeStar || phase !== "selected") return;
    setPhase("revealed");
    fireConfetti();

    setTimeout(() => {
      markUsed(activeStar.id);
      setActiveStar(null);
      setPhase("grid");
    }, 4000);
  };

  // Reset phase on game restart
  useEffect(() => {
    if (allDone) {
      setActiveStar(null);
      setPhase("grid");
    }
  }, [allDone]);

  const activeSection = sectionById(activeStar?.sectionId ?? null);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-cosmos">
      <StarField count={60} />
      <AdminPanel sections={sections} onUpdate={updateSections} onReset={resetGame} />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-bold text-magic text-glow"
        >
          ✨ Жұлдызды таңдау ✨
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-3 text-lg md:text-xl text-muted-foreground font-body"
        >
          Жұлдызыңды таңдап, өз секцияңды біл!
        </motion.p>
        <p className="mt-2 text-sm text-primary/80">
          Қалған жұлдыздар: <span className="font-bold text-primary">{remaining}</span> / {stars.length}
        </p>
      </header>

      {/* Stars grid */}
      {!allDone && (
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4" style={{ height: "min(70vh, 720px)" }}>
          <div className="relative w-full h-full">
            <AnimatePresence>
              {stars.map((star) => {
                if (star.used) return null;
                const isActive = activeStar?.id === star.id;
                const shouldHide = phase !== "grid" && !isActive;

                return (
                  <motion.button
                    key={star.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isActive && phase !== "grid"
                        ? { opacity: 1, scale: 1 }
                        : shouldHide
                        ? { opacity: 0, scale: 0, rotate: 180 }
                        : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: isActive ? 0.9 : 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    whileHover={phase === "grid" ? { scale: 1.15, rotate: 8 } : undefined}
                    whileTap={phase === "grid" ? { scale: 0.92 } : undefined}
                    onClick={() => {
                      if (isActive && phase === "selected") handleReveal();
                      else handleStarClick(star);
                    }}
                    className={`${isActive && phase !== "grid" ? "fixed" : "absolute"} cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-primary/60 rounded-full`}
                    style={
                      isActive && phase !== "grid"
                        ? {
                            zIndex: 50,
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }
                        : {
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            transform: "translate(-50%, -50%)",
                            pointerEvents: shouldHide ? "none" : "auto",
                          }
                    }
                  >
                    <motion.div
                      animate={
                        isActive
                          ? { rotate: phase === "selected" ? [0, -8, 8, 0] : 0 }
                          : { y: [0, -8, 0] }
                      }
                      transition={
                        isActive
                          ? { duration: 1.2, repeat: Infinity }
                          : {
                              duration: 3 + (star.id % 3),
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: (star.id % 5) * 0.3,
                            }
                      }
                      style={{ willChange: "transform" }}
                    >
                      <StarShape
                        size={isActive && phase !== "grid" ? Math.min(360, window.innerWidth * 0.5) : star.size}
                        color={
                          star.id % 5 === 0
                            ? "hsl(320 95% 70%)"
                            : star.id % 5 === 1
                            ? "hsl(190 95% 65%)"
                            : "hsl(45 100% 60%)"
                        }
                      />
                    </motion.div>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {/* Backdrop when star selected */}
            <AnimatePresence>
              {phase === "selected" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-20 bg-background/70 backdrop-blur-sm pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Hint when star is enlarged */}
            <AnimatePresence>
              {phase === "selected" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 1 }}
                  className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 text-center pointer-events-none"
                >
                  <p className="font-display text-2xl md:text-3xl text-primary text-glow">
                    Жұлдызды тағы бір рет бас 👆
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reveal: section emblem */}
            <AnimatePresence>
              {phase === "revealed" && activeSection && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                  className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
                >
                  {/* Magic burst rings */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-64 h-64 rounded-full border-4 border-primary"
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 5, opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                    className="absolute w-64 h-64 rounded-full border-4 border-accent"
                  />
                  <div className="absolute w-[420px] h-[420px] bg-nebula rounded-full blur-2xl" />

                  <div className="relative flex flex-col items-center gap-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {[...Array(8)].map((_, i) => (
                        <Sparkles
                          key={i}
                          className="absolute w-8 h-8 text-primary"
                          style={{
                            transform: `rotate(${i * 45}deg) translateY(-180px)`,
                          }}
                        />
                      ))}
                    </motion.div>

                    <motion.img
                      src={activeSection.image}
                      alt={activeSection.name}
                      className="w-72 h-72 md:w-96 md:h-96 object-contain star-pulse-glow"
                      initial={{ rotate: -180 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="font-display text-5xl md:text-7xl font-bold text-magic text-glow text-center px-4"
                    >
                      {activeSection.name}
                    </motion.h2>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Final screen */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center text-center px-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-8"
            >
              <StarShape size={180} color="hsl(45 100% 60%)" className="star-pulse-glow" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-6xl font-bold text-magic text-glow max-w-3xl"
            >
              Барлық балалар секцияларға бөлінді! 🎉
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-xl text-muted-foreground"
            >
              Ғарыштық саяхат аяқталды ✨
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={() => {
                  resetGame();
                  fireConfetti();
                }}
                className="mt-10 px-10 py-7 text-xl font-display font-bold bg-magic text-primary-foreground rounded-full glow-soft hover:glow-intense transition-all"
              >
                🚀 Қайта бастау
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Index;
