import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  Atom,
  Palette,
  Hourglass,
  Flame,
  Globe,
  Feather,
  BookOpen,
  ChevronRight,
  Eye,
  Scroll,
  Sun,
  Layers,
  Lightbulb,
} from "lucide-react";

interface ConsciousnessEpoch {
  id: string;
  title: string;
  subhead: string;
  timeframe: string;
  pillar: "consciousness" | "science" | "art" | "history";
  pillarLabel: string;
  badgeColor: string;
  summary: string;
  quote: { text: string; author: string; role: string };
  milestones: { title: string; desc: string; icon: string }[];
  reflection: string;
}

const EPOCHS: ConsciousnessEpoch[] = [
  {
    id: "awakening",
    title: "The Primal Awakening",
    subhead: "The Emergence of Selfhood, Fire & Cosmic Wonder",
    timeframe: "100,000 BCE – 3,000 BCE",
    pillar: "consciousness",
    pillarLabel: "Origin of Mind",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    summary:
      "Beneath unpolluted Pleistocene skies, Homo sapiens crossed the cognitive Rubicon. The mastery of fire extended the day, while ochre murals on cave walls transformed fleeting thoughts into immortal symbols. For the first time on Earth, matter began to question its own existence.",
    quote: {
      text: "We are a way for the cosmos to know itself. Some part of our being knows this is where we came from. We long to return; and we can, because the cosmos is also within us.",
      author: "Carl Sagan",
      role: "Cosmologist & Author",
    },
    milestones: [
      {
        title: "Taming the Flame",
        desc: "Harnessing fire unlocked cooked nutrition, communal nocturnal storytelling, and deep reflective thinking around the hearth.",
        icon: "flame",
      },
      {
        title: "Symbolic Murals (Chauvet & Blombos)",
        desc: "Silhouettes of hands blown in charcoal and ochre: the birth of externalized memory and spiritual consciousness.",
        icon: "eye",
      },
      {
        title: "Göbekli Tepe & Cosmic Alignments",
        desc: "Monumental stone megaliths erected before agriculture, proving sacred wonder preceded settled civilizations.",
        icon: "compass",
      },
    ],
    reflection:
      "When a modern scholar opens a blank notebook, that gesture echoes the first hand pressed against the cavern wall: an inextinguishable refusal to let consciousness fade.",
  },
  {
    id: "science",
    title: "The Scientific Consciousness",
    subhead: "The Language of Nature, Empirical Rigor & Mathematical Cosmos",
    timeframe: "600 BCE – Present Day",
    pillar: "science",
    pillarLabel: "Empirical Reason",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60",
    summary:
      "From Thales asking what the world is made of to Newton uniting the falling apple with the orbiting moon, science revealed that the universe is not capricious magic, but an intelligible symphony governed by immutable mathematical laws.",
    quote: {
      text: "Nature's great book is written in mathematical language. Its characters are triangles, circles and other geometric figures, without which humanly it is impossible to comprehend a single word.",
      author: "Galileo Galilei",
      role: "Father of Modern Observational Astronomy",
    },
    milestones: [
      {
        title: "Euclidean Proof & Aristotelian Logic",
        desc: "Deductive reasoning established that truths could be proven universally through axiomatic clarity.",
        icon: "lightbulb",
      },
      {
        title: "Alhazen & The Empirical Method",
        desc: "In 11th-century Cairo, Ibn al-Haytham founded experimental optics, commanding scholars to doubt authority and test reality.",
        icon: "sun",
      },
      {
        title: "Maxwell, Einstein & Quantum Frontiers",
        desc: "From the unification of electromagnetism to spacetime curvature and quantum mechanics, human minds decoded cosmic foundations.",
        icon: "atom",
      },
    ],
    reflection:
      "Every time a student derives a formula, parses an algorithm, or measures an electrical pulse in a lab, they participate directly in humanity's greatest detective story.",
  },
  {
    id: "art",
    title: "The Aesthetic Soul",
    subhead: "Sensory Architecture, Sacred Proportions & Creative Transcendence",
    timeframe: "Perpetual Human Continuum",
    pillar: "art",
    pillarLabel: "Artistic Consciousness",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    summary:
      "Art is not mere decoration—it is the highest sensory apparatus of consciousness. Through the Golden Ratio (Phi), perspective, polyphony, poetry, and sculpture, human emotion discovers structured form and touches the sublime.",
    quote: {
      text: "Where the spirit does not work with the hand, there is no art. Principles for the Development of a Complete Mind: Study the science of art. Study the art of science. Learn how to see. Realize that everything connects to everything else.",
      author: "Leonardo da Vinci",
      role: "Universal Renaissance Polymath",
    },
    milestones: [
      {
        title: "The Golden Ratio & Divine Proportion",
        desc: "From the Parthenon to nautilus shells and the Mona Lisa, mathematical harmony guides aesthetic beauty.",
        icon: "palette",
      },
      {
        title: "Benin Bronzes & African Fractal Design",
        desc: "Intricate lost-wax metallurgies and recursive geometric architecture reflecting complex ancestral cosmic philosophies.",
        icon: "layers",
      },
      {
        title: "Polyphonic Harmony & Literary Epics",
        desc: "The architecture of Bach fugues and Homeric/Griot narratives structuring raw human longing into enduring timeless order.",
        icon: "feather",
      },
    ],
    reflection:
      "True scholarship is itself an art form: elegance in code, clarity in expository prose, and harmony in conceptual design.",
  },
  {
    id: "history",
    title: "The Living Historical Archive",
    subhead: "The Transmission of Wisdom Across the Abyss of Mortality",
    timeframe: "3,000 BCE – The Digital Age",
    pillar: "history",
    pillarLabel: "Historical Memory",
    badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
    summary:
      "Individual mortals perish, but human consciousness endures through preservation. Through clay cuneiform, papyrus scrolls, the House of Wisdom, Sankore manuscripts in Timbuktu, and modern cloud databases, we stand upon the shoulders of giants.",
    quote: {
      text: "Books are the carriers of civilization. Without books, history is silent, literature dumb, science crippled, thought and speculation at a standstill.",
      author: "Barbara Tuchman",
      role: "Historian & Pulitzer Laureate",
    },
    milestones: [
      {
        title: "Alexandria & Bayt al-Hikma",
        desc: "The ancient universal library of Ptolemy and the Abbasid House of Wisdom translating world philosophies across civilizations.",
        icon: "scroll",
      },
      {
        title: "University of Sankore in Timbuktu",
        desc: "West African golden age of intellectual preservation: thousands of manuscripts on jurisprudence, astronomy, and mathematics.",
        icon: "bookOpen",
      },
      {
        title: "Gutenberg to the Hyperlink",
        desc: "Movable type democratized the book, setting the stage for digital global memory repositories like Lucid.",
        icon: "globe",
      },
    ],
    reflection:
      "You do not study in isolation. You inherit the unbroken testament of thousands of generations who kept the torch burning.",
  },
];

interface Luminary {
  name: string;
  years: string;
  origin: string;
  field: string;
  quote: string;
}

const LUMINARIES: Luminary[] = [
  {
    name: "Hypatia of Alexandria",
    years: "c. 360 – 415 CE",
    origin: "Alexandria, Egypt",
    field: "Mathematics & Astronomy",
    quote: "Reserve your right to think, for even to think wrongly is better than not to think at all.",
  },
  {
    name: "Ibn al-Haytham (Alhazen)",
    years: "965 – 1040 CE",
    origin: "Basra & Cairo",
    field: "Optics & Scientific Method",
    quote: "The duty of the man who investigates the writings of scientists is to make himself an enemy of all that he reads.",
  },
  {
    name: "Leonardo da Vinci",
    years: "1452 – 1519 CE",
    origin: "Florence, Italy",
    field: "Art, Anatomy & Engineering",
    quote: "Learning never exhausts the mind.",
  },
  {
    name: "Ada Lovelace",
    years: "1815 – 1852 CE",
    origin: "London, England",
    field: "Poetical Science & Computation",
    quote: "The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.",
  },
  {
    name: "Wangari Maathai",
    years: "1940 – 2011 CE",
    origin: "Nyeri, Kenya",
    field: "Biology, Ecology & Peace",
    quote: "You cannot protect the environment unless you empower people, you inform them, and you help them understand.",
  },
  {
    name: "Richard Feynman",
    years: "1918 – 1988 CE",
    origin: "New York, USA",
    field: "Theoretical Physics & Education",
    quote: "I can live with doubt, uncertainty, and not knowing. It is much more interesting to live with questions than answers.",
  },
];

export function ConsciousnessOdysseySection() {
  const [selectedEpochId, setSelectedEpochId] = useState<string>("awakening");
  const activeEpoch = EPOCHS.find((e) => e.id === selectedEpochId) || EPOCHS[0];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-200/80 dark:border-slate-800">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-300 shadow-2xs">
          <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
          <span>The Human Odyssey • Mind, Science, Art & History</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
          The Awakening of Human Consciousness
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-slate-300 leading-relaxed">
          Behind every equation solved, every note transcribed, and every exam passed lies an extraordinary 100,000-year story. Explore the four pillars that shaped our intellectual world and illuminate your academic journey today.
        </p>
      </div>

      {/* 4 Pillars Navigation Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {EPOCHS.map((ep) => {
          const isSelected = ep.id === selectedEpochId;
          return (
            <button
              key={ep.id}
              onClick={() => setSelectedEpochId(ep.id)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? "bg-white dark:bg-slate-800/90 border-[#006d64] shadow-md ring-2 ring-[#006d64]/20"
                  : "bg-white/60 dark:bg-slate-900/60 border-neutral-200 dark:border-slate-800 hover:border-neutral-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${ep.badgeColor}`}>
                  {ep.pillarLabel}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#006d64] animate-pulse" />
                )}
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                {ep.title}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-slate-400 mt-1 font-mono">
                {ep.timeframe}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Epoch Deep Dive Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200/90 dark:border-slate-800 shadow-xl overflow-hidden mb-16 transition-all">
        {/* Banner Bar */}
        <div className="bg-gradient-to-r from-[#006d64] via-[#094d47] to-[#121526] p-6 sm:p-8 text-white">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              Pillar of {activeEpoch.pillarLabel} • {activeEpoch.timeframe}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
              {activeEpoch.title}
            </h3>
            <p className="text-sm text-teal-100/90">
              {activeEpoch.subhead}
            </p>
          </div>
        </div>

        {/* Card Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Summary & Milestones */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-slate-500 mb-2">
                The Philosophical Narrative
              </h4>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-slate-300 leading-relaxed">
                {activeEpoch.summary}
              </p>
            </div>

            {/* Milestones */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 dark:text-slate-500">
                Key Evolutionary Milestones
              </h4>
              <div className="space-y-2.5">
                {activeEpoch.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neutral-50 dark:bg-slate-800/70 border border-neutral-200/70 dark:border-slate-700 flex items-start gap-3.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#006d64] dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                      {m.icon === "flame" && <Flame size={16} />}
                      {m.icon === "eye" && <Eye size={16} />}
                      {m.icon === "compass" && <Compass size={16} />}
                      {m.icon === "lightbulb" && <Lightbulb size={16} />}
                      {m.icon === "sun" && <Sun size={16} />}
                      {m.icon === "atom" && <Atom size={16} />}
                      {m.icon === "palette" && <Palette size={16} />}
                      {m.icon === "layers" && <Layers size={16} />}
                      {m.icon === "feather" && <Feather size={16} />}
                      {m.icon === "scroll" && <Scroll size={16} />}
                      {m.icon === "bookOpen" && <BookOpen size={16} />}
                      {m.icon === "globe" && <Globe size={16} />}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                        {m.title}
                      </h5>
                      <p className="text-[12px] text-neutral-600 dark:text-slate-400 mt-0.5 leading-snug">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quote Box & Academic Bridge */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Voice Quote */}
            <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-neutral-800 dark:text-amber-100 space-y-4">
              <span className="text-3xl font-serif text-amber-500 dark:text-amber-400 block leading-none">“</span>
              <p className="text-sm font-serif italic leading-relaxed">
                {activeEpoch.quote.text}
              </p>
              <div className="pt-2 border-t border-amber-200/70 dark:border-amber-800/50">
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  {activeEpoch.quote.author}
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                  {activeEpoch.quote.role}
                </p>
              </div>
            </div>

            {/* Bridge to the Modern Scholar */}
            <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#006d64] dark:text-teal-300">
                <Sparkles size={14} />
                <span>The Synthesis in Your Studies Today</span>
              </div>
              <p className="text-xs text-neutral-700 dark:text-slate-300 leading-relaxed">
                {activeEpoch.reflection}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Luminaries of Human Thought */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold font-serif text-neutral-900 dark:text-white">
              Voices of the Awakening Mind
            </h3>
            <p className="text-xs text-neutral-500 dark:text-slate-400">
              Thinkers across geography and centuries who expanded human understanding
            </p>
          </div>
          <span className="text-xs font-bold text-[#006d64] dark:text-teal-400">
            6 Intellectual Archetypes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LUMINARIES.map((lum, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 shadow-2xs hover:border-[#006d64]/60 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {lum.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-slate-400 font-mono">
                    {lum.years} • {lum.origin}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 font-semibold">
                  {lum.field}
                </span>
              </div>

              <p className="text-xs italic text-neutral-600 dark:text-slate-300 leading-relaxed border-l-2 border-[#006d64] pl-2.5">
                "{lum.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
