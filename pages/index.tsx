import Head from "next/head";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

import { EDUCATION, EXPERIENCE, FEATURED_PROJECTS, PROFILE, SKILL_GROUPS } from "@/lib/profileData";
import profilePhoto from "@/my data/my image.jpeg";

const navigation = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
];

const quickPrompts = [
  "What makes Khaled strong for an AI Engineer role?",
  "Summarize his best LLM and RAG projects.",
  "What backend and cloud experience does he have?",
];

const CONFIGURED_PYTHON_API_BASE = process.env.NEXT_PUBLIC_PYTHON_API_URL ?? "/api";

function apiEndpoint(action: "chat" | "contact") {
  const base = getPythonApiBase();
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}action=${action}`;
}

function getPythonApiBase() {
  if (typeof window === "undefined") {
    return CONFIGURED_PYTHON_API_BASE;
  }

  const isLocalPage = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const pointsToLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?/i.test(CONFIGURED_PYTHON_API_BASE);

  if (!isLocalPage && pointsToLocalApi) {
    return "/api";
  }

  return CONFIGURED_PYTHON_API_BASE;
}

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type ChatApiResponse = {
  reply?: string;
  showContactTool?: boolean;
  error?: string;
};

type ContactApiResponse = {
  ok?: boolean;
  error?: string;
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`${PROFILE.name} | AI Engineer Portfolio`}</title>
        <meta
          name="description"
          content="Creative AI Engineer portfolio for Khaled Mohamed, focused on LLM engineering, RAG, agentic systems, search, backend AI, and deployment."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen overflow-hidden bg-[#050907] text-[#eef7f3]">
        <Header />
        <main>
          <Hero />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <AssistantSection />
        </main>
        <FloatingRobot onOpenChat={() => setIsChatOpen(true)} />
        <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#7df6dd]/12 bg-[#050907]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="group flex items-center gap-3">
          <span className="relative size-11 overflow-hidden rounded-md border border-[#7df6dd]/25 shadow-[0_0_28px_rgba(125,246,221,0.18)]">
            <Image
              src={profilePhoto}
              alt={`${PROFILE.name} portrait`}
              className="h-full w-full object-cover object-[52%_14%]"
              sizes="44px"
            />
            <span className="absolute -right-1 -top-1 size-2 rounded-sm bg-[#f5b84b]" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase text-white">{PROFILE.role}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] p-1 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded px-4 py-2 text-sm font-medium text-[#cbd8d2] transition hover:bg-[#7df6dd]/10 hover:text-[#7df6dd]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden w-[164px] lg:block" aria-hidden="true" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-white/10 pt-24">
      <div className="absolute inset-0 -z-20 bg-[#050907]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(5,9,7,0.98)_0%,rgba(5,9,7,0.84)_45%,rgba(12,36,31,0.58)_100%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-16 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            Khaled Mohamed
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#b9c9c1] sm:text-xl">
            AI Engineer specializing in Large Language Models, Retrieval-Augmented Generation, and multi-agent systems.
            Experienced in building end-to-end AI applications from data processing to deployment using Python, FastAPI,
            Docker, and modern machine learning frameworks. Strong background in NLP and multimodal systems, with
            hands-on exposure to Google Cloud Platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-md bg-[#7df6dd] px-5 py-3 text-sm font-semibold text-[#04100c] shadow-[0_0_28px_rgba(125,246,221,0.2)] transition hover:bg-white"
            >
              Explore projects
            </a>
            <a
              href="#assistant"
              className="rounded-md border border-white/18 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#7df6dd]/60 hover:bg-[#7df6dd]/10"
            >
              Send a message
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="bg-[#e8f0ea] px-5 py-20 text-[#07100c] lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker text-[#087968]">Selected AI systems</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Projects with visible engineering depth.</h2>
          </div>
          <p className="max-w-md leading-7 text-[#3b4a42]">
            Each project is framed like a system: problem space, architecture signal, stack, and outcome.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED_PROJECTS.map((project, index) => (
            <article key={project.title} className="rounded-lg border border-[#07100c]/10 bg-white p-6 shadow-[0_18px_50px_rgba(7,16,12,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs uppercase text-[#087968]">{project.category}</p>
                <span className="rounded bg-[#07100c] px-2 py-1 font-mono text-xs text-[#7df6dd]">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[#07100c]">{project.title}</h3>
              <p className="mt-4 leading-7 text-[#39463f]">{project.description}</p>
              <div className="mt-6 border-l-2 border-[#f5b84b] pl-4">
                <p className="font-mono text-xs uppercase text-[#8a5c05]">impact</p>
                <p className="mt-2 text-sm leading-6 text-[#18231d]">{project.impact}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-md bg-[#e9f4ef] px-3 py-1.5 text-xs font-semibold text-[#0e3d34]">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative bg-[#050907] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.66fr_1.34fr]">
          <div>
            <p className="section-kicker">Trajectory</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              AI work connected to backend delivery.
            </h2>
            <p className="mt-5 leading-8 text-[#aebdb6]">
              A timeline across applied AI, search, agent tooling, backend systems, data science, and delivery discipline.
            </p>
          </div>

          <div className="relative space-y-4 before:absolute before:left-4 before:top-3 before:h-[calc(100%-24px)] before:w-px before:bg-[#7df6dd]/20">
            {EXPERIENCE.map((item) => (
              <article key={`${item.company}-${item.role}`} className="relative pl-11">
                <span className="absolute left-[11px] top-6 size-3 rounded-sm bg-[#7df6dd] shadow-[0_0_18px_rgba(125,246,221,0.8)]" />
                <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                      <p className="mt-1 font-medium text-[#7df6dd]">{item.company}</p>
                    </div>
                    <p className="font-mono text-sm text-[#f5b84b]">{item.duration}</p>
                  </div>
                  <p className="mt-2 text-sm text-[#91a39a]">{item.location}</p>
                  <ul className="mt-5 space-y-3">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex gap-3 leading-7 text-[#cfdbd5]">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#f5b84b]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="bg-[#07100c] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="section-kicker">Stack map</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">A toolkit for AI product engineering.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SKILL_GROUPS.map((group) => (
                <article key={group.title} className="rounded-lg border border-[#7df6dd]/12 bg-[#0d1712] p-6">
                  <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span key={skill} className="rounded-md border border-white/8 bg-white/[0.055] px-3 py-1.5 text-sm text-[#dce8e2]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[#f5b84b]/18 bg-[#11170f] p-7 text-white">
            <p className="section-kicker text-[#f5b84b]">Education module</p>
            <h3 className="mt-4 text-3xl font-semibold">{EDUCATION.school}</h3>
            <p className="mt-3 text-[#dce8e2]">{EDUCATION.degree}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-white/10 bg-white/[0.05] p-4">
                <dt className="text-sm text-[#aebdb6]">Graduation</dt>
                <dd className="mt-1 text-2xl font-semibold text-[#7df6dd]">{EDUCATION.graduation}</dd>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.05] p-4">
                <dt className="text-sm text-[#aebdb6]">Grade</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{EDUCATION.grade}</dd>
              </div>
            </dl>
            <p className="mt-6 leading-8 text-[#dce8e2]">{EDUCATION.project}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function AssistantSection() {
  return (
    <section id="assistant" className="bg-[#e8f0ea] px-5 py-20 text-[#07100c] lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-kicker text-[#087968]">Contact channel</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Send Khaled a message.</h2>
          <p className="mt-5 max-w-2xl leading-8 text-[#39463f]">
            Recruiter links and role details are routed cleanly alongside the portfolio.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#07100c]/10 bg-white p-5 transition hover:border-[#087968]/60"
            >
              <span className="font-mono text-xs uppercase text-[#087968]">Repository signal</span>
              <strong className="mt-2 block text-lg text-[#07100c]">GitHub portfolio</strong>
              <span className="mt-2 block text-sm text-[#3b4a42]">github.com/devkhaledai-hub</span>
            </a>
            <a
              href={PROFILE.linkedIn}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#07100c]/10 bg-white p-5 transition hover:border-[#087968]/60"
            >
              <span className="font-mono text-xs uppercase text-[#087968]">Career profile</span>
              <strong className="mt-2 block text-lg text-[#07100c]">LinkedIn</strong>
              <span className="mt-2 block text-sm text-[#3b4a42]">linkedin.com/in/khaled-mohamed-753855284</span>
            </a>
          </div>
        </div>

        <ContactForm source="page" />
      </div>
    </section>
  );
}

function FloatingRobot({ onOpenChat }: { onOpenChat: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [robotOffset, setRobotOffset] = useState(0);

  useEffect(() => {
    function updateRobotOffset() {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      const drift = Math.sin(progress * Math.PI * 2) * 34;
      setRobotOffset(Math.round(progress * 120 + drift));
    }

    updateRobotOffset();
    window.addEventListener("scroll", updateRobotOffset, { passive: true });
    window.addEventListener("resize", updateRobotOffset);

    return () => {
      window.removeEventListener("scroll", updateRobotOffset);
      window.removeEventListener("resize", updateRobotOffset);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let cleanup = () => {};

    async function initRobot() {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const THREE = await import("three");

      if (!isMounted) {
        return;
      }

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas,
        preserveDrawingBuffer: true,
      });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      const robot = new THREE.Group();
      const clock = new THREE.Clock();

      renderer.setClearAlpha(0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.position.set(0, 0.25, 7.2);
      scene.add(new THREE.AmbientLight(0x9ee8df, 1.8));

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
      keyLight.position.set(3, 4, 5);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0x7df6dd, 22, 12);
      rimLight.position.set(-2.8, 1.5, 3.2);
      scene.add(rimLight);

      const shell = new THREE.MeshStandardMaterial({
        color: 0x101c17,
        metalness: 0.72,
        roughness: 0.28,
      });
      const accent = new THREE.MeshStandardMaterial({
        color: 0x7df6dd,
        emissive: 0x1fd8be,
        emissiveIntensity: 0.75,
        metalness: 0.35,
        roughness: 0.2,
      });
      const gold = new THREE.MeshStandardMaterial({
        color: 0xf5b84b,
        emissive: 0x6a4308,
        emissiveIntensity: 0.35,
        metalness: 0.48,
        roughness: 0.3,
      });
      const darkGlass = new THREE.MeshStandardMaterial({
        color: 0x0a120f,
        metalness: 0.3,
        roughness: 0.18,
      });

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.7, 0.72), shell);
      body.position.y = -0.45;
      robot.add(body);

      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.42, 0.08), accent);
      chest.position.set(0, -0.36, 0.39);
      robot.add(chest);

      const head = new THREE.Mesh(new THREE.BoxGeometry(1.26, 1, 0.76), shell);
      head.position.y = 0.98;
      robot.add(head);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.28, 0.08), darkGlass);
      visor.position.set(0, 1.02, 0.43);
      robot.add(visor);

      const eyeGeometry = new THREE.SphereGeometry(0.07, 24, 24);
      const leftEye = new THREE.Mesh(eyeGeometry, accent);
      leftEye.position.set(-0.22, 1.03, 0.49);
      const rightEye = leftEye.clone();
      rightEye.position.x = 0.22;
      robot.add(leftEye, rightEye);

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 16), accent);
      antenna.position.set(0.38, 1.67, 0);
      antenna.rotation.z = -0.28;
      const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 24), gold);
      antennaTip.position.set(0.44, 1.86, 0);
      robot.add(antenna, antennaTip);

      const shoulderGeometry = new THREE.SphereGeometry(0.18, 24, 24);
      const armGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1.1, 18);
      const leftShoulder = new THREE.Mesh(shoulderGeometry, accent);
      leftShoulder.position.set(-0.94, 0.05, 0);
      const rightShoulder = leftShoulder.clone();
      rightShoulder.position.x = 0.94;
      const leftArm = new THREE.Mesh(armGeometry, shell);
      leftArm.position.set(-1.08, -0.56, 0);
      leftArm.rotation.z = -0.18;
      const rightArm = new THREE.Mesh(armGeometry, shell);
      rightArm.position.set(1.08, -0.56, 0);
      rightArm.rotation.z = 0.18;
      robot.add(leftShoulder, rightShoulder, leftArm, rightArm);

      const legGeometry = new THREE.CylinderGeometry(0.16, 0.18, 0.86, 18);
      const leftLeg = new THREE.Mesh(legGeometry, shell);
      leftLeg.position.set(-0.34, -1.78, 0);
      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 0.34;
      const footGeometry = new THREE.BoxGeometry(0.48, 0.18, 0.68);
      const leftFoot = new THREE.Mesh(footGeometry, accent);
      leftFoot.position.set(-0.34, -2.26, 0.08);
      const rightFoot = leftFoot.clone();
      rightFoot.position.x = 0.34;
      robot.add(leftLeg, rightLeg, leftFoot, rightFoot);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.42, 0.016, 12, 96),
        new THREE.MeshStandardMaterial({
          color: 0x7df6dd,
          emissive: 0x1fd8be,
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.55,
        }),
      );
      ring.rotation.x = Math.PI / 2.4;
      ring.position.y = -0.34;
      robot.add(ring);

      robot.rotation.x = -0.05;
      robot.rotation.y = -0.38;
      scene.add(robot);

      const resize = () => {
        const parent = canvas.parentElement;
        const size = parent ? Math.max(1, Math.floor(parent.getBoundingClientRect().width)) : 170;
        renderer.setSize(size, size, false);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      let animationFrame = 0;
      const animate = () => {
        const elapsed = clock.getElapsedTime();
        robot.position.y = Math.sin(elapsed * 1.8) * 0.16;
        robot.rotation.y = -0.38 + Math.sin(elapsed * 0.72) * 0.28;
        leftArm.rotation.z = -0.18 + Math.sin(elapsed * 2.4) * 0.18;
        rightArm.rotation.z = 0.18 - Math.sin(elapsed * 2.4) * 0.18;
        antenna.rotation.z = -0.28 + Math.sin(elapsed * 3.2) * 0.12;
        ring.rotation.z = elapsed * 0.65;
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };

      animate();

      cleanup = () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        renderer.dispose();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();

            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      };
    }

    void initRobot();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, []);

  function openChatbot() {
    onOpenChat();
  }

  return (
    <button
      type="button"
      aria-label="Open Khaled portfolio chatbot"
      onClick={openChatbot}
      className="robot-guide group fixed right-1 z-50 grid size-[142px] place-items-center bg-transparent transition-transform duration-300 hover:scale-105 sm:right-4 sm:size-[188px]"
      style={{ top: `calc(90px + ${robotOffset}px)` }}
    >
      <canvas ref={canvasRef} className="size-full" data-robot-canvas="true" />
      <span className="pointer-events-none absolute bottom-2 rounded-md bg-[#7df6dd] px-2 py-1 text-xs font-semibold text-[#04100c] opacity-0 shadow-[0_0_22px_rgba(125,246,221,0.4)] transition group-hover:opacity-100">
        Ask AI
      </span>
    </button>
  );
}

function ChatAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I am ready. Ask about Khaled's RAG systems, agent workflows, backend experience, projects, or hiring fit.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showContactTool, setShowContactTool] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function sendMessage(prompt?: string) {
    const content = (prompt ?? draft).trim();

    if (!content || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch(apiEndpoint("chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "The assistant could not answer right now.");
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);

      if (data.showContactTool) {
        setShowContactTool(true);
      }
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            error instanceof Error ? error.message : "The assistant could not answer right now.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-[#020503]/70 px-4 py-5 backdrop-blur-md sm:px-6">
      <aside className="relative ml-auto flex max-h-[calc(100vh-40px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[#7df6dd]/18 bg-[#050907] p-4 text-white shadow-[0_28px_90px_rgba(0,0,0,0.45),0_0_50px_rgba(125,246,221,0.12)]">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-xs uppercase text-[#7df6dd]">portfolio.ai</p>
          <h3 className="mt-1 text-2xl font-semibold">Khaled screening console</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowContactTool((value) => !value)}
            className="rounded-md border border-white/18 px-3 py-2 text-xs font-semibold text-white transition hover:border-[#7df6dd]/60 hover:bg-[#7df6dd]/10"
          >
            Email
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/18 px-3 py-2 text-xs font-semibold text-white transition hover:border-[#7df6dd]/60 hover:bg-[#7df6dd]/10"
          >
            Close
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            disabled={isSending}
            className="rounded-md border border-white/8 bg-white/[0.055] px-3 py-3 text-left text-sm leading-5 text-[#edf7f2] transition hover:border-[#7df6dd]/45 hover:bg-[#7df6dd]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg border border-white/8 bg-[#07100c] p-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-[#087968] text-white"
                : "border border-white/10 bg-white text-[#07100c]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isSending ? (
          <div className="max-w-[78%] rounded-lg bg-white px-4 py-3 text-sm text-[#07100c]">Reasoning over profile context...</div>
        ) : null}
      </div>

      {showContactTool ? (
        <div className="absolute inset-x-4 bottom-4 top-[92px] z-10 overflow-y-auto rounded-lg bg-white p-5 text-[#07100c] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase text-[#087968]">Email</p>
              <h4 className="mt-1 text-xl font-semibold">Send Khaled a message</h4>
            </div>
            <button
              type="button"
              onClick={() => setShowContactTool(false)}
              className="rounded-md border border-[#07100c]/10 px-3 py-2 text-sm font-semibold transition hover:border-[#087968]/50"
            >
              Close
            </button>
          </div>
          <ContactForm compact source="chat" />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="assistant-message" className="sr-only">
          Ask the assistant
        </label>
        <input
          id="assistant-message"
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about RAG, agents, backend, or fit..."
          className="min-w-0 flex-1 rounded-md border border-white/12 bg-white px-4 py-3 text-sm text-[#07100c] outline-none transition focus:border-[#7df6dd]"
        />
        <button
          type="submit"
          disabled={isSending}
          className="rounded-md bg-[#7df6dd] px-4 py-3 text-sm font-semibold text-[#04100c] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </aside>
    </div>
  );
}

function ContactForm({ compact = false, source }: { compact?: boolean; source: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: fieldValue(formData.get("name")),
      email: fieldValue(formData.get("email")),
      company: fieldValue(formData.get("company")),
      subject: fieldValue(formData.get("subject")),
      message: fieldValue(formData.get("message")),
      source,
    };

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch(apiEndpoint("contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Message could not be sent.");
      }

      form.reset();
      setStatus("sent");
      setFeedback("Message sent. Khaled will receive it by email.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-lg border border-[#07100c]/10 bg-white ${compact ? "border-0 p-0" : "p-6"}`}
    >
      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field id={`${source}-name`} name="name" label="Name" placeholder="Your name" />
        <Field id={`${source}-email`} name="email" label="Email" type="email" placeholder="you@company.com" />
        <Field id={`${source}-company`} name="company" label="Company" placeholder="Company name" />
        <Field id={`${source}-subject`} name="subject" label="Subject" placeholder="Interview opportunity" />
      </div>
      <div className="mt-3">
        <label htmlFor={`${source}-message`} className="text-sm font-semibold text-[#07100c]">
          Message
        </label>
        <textarea
          id={`${source}-message`}
          name="message"
          required
          minLength={20}
          rows={compact ? 4 : 5}
          placeholder="Write the role, timeline, and best way to continue."
          className="mt-2 w-full resize-none rounded-md border border-[#07100c]/12 bg-white px-3 py-3 text-sm text-[#07100c] outline-none transition focus:border-[#087968]"
        />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-[#087968] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#065f53] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        {feedback ? (
          <p className={`text-sm ${status === "sent" ? "text-[#087968]" : "text-[#9f2f1f]"}`}>{feedback}</p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[#07100c]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={name === "name" || name === "email"}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-[#07100c]/12 bg-white px-3 py-3 text-sm text-[#07100c] outline-none transition focus:border-[#087968]"
      />
    </div>
  );
}

function fieldValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}
