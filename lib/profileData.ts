export const PROFILE = {
  name: "Khaled Mohamed",
  role: "AI Engineer",
  location: "Alexandria, Egypt",
  email: "devkhaled.ai@gmail.com",
  phone: "+201227117525",
  github: "https://github.com/devkhaledai-hub",
  linkedIn: "https://linkedin.com/in/khaled-mohamed-753855284",
  summary:
    "AI Engineer specializing in LLM engineering, RAG systems, multi-agent workflows, semantic search, backend development, and cloud AI deployment.",
  headline:
    "I build production-minded AI systems that combine retrieval, ranking, agents, backend APIs, and cloud deployment.",
  metrics: [
    { value: "540+", label: "AI training hours" },
    { value: "95%", label: "NTI AI track score" },
    { value: "3.7", label: "University GPA" },
    { value: "1st", label: "DEPI final project" },
  ],
  highlights: [
    "Built production-style search and re-ranking pipelines using Tantivy, LightGBM LambdaRank, and MiniLM embeddings.",
    "Created MCP tools and multi-agent research workflows for LibreChat, including search, fetch, PDF, and email delivery tools.",
    "Delivered full-stack AI applications with FastAPI, React, Docker, Cloud Run, Modal, Vertex AI, and Google ADK.",
  ],
  interests: [
    "LLM Engineering",
    "Agentic AI Systems",
    "RAG Systems",
    "Semantic Search",
    "AI Deployment",
    "Cloud AI Infrastructure",
  ],
};

export const FEATURED_PROJECTS = [
  {
    title: "GCP Content Creator Agent",
    category: "Multi-agent content platform",
    description:
      "A Google Cloud based content generation system with orchestrator, research, drafting, quality, improvement, and SEO agents.",
    impact:
      "Turns content requests into coordinated agent workflows for blog posts, newsletters, social posts, metadata, and text analysis.",
    stack: ["Google ADK", "Gemini", "React", "FastAPI", "Cloud Run", "Vertex AI", "Docker"],
  },
  {
    title: "Semantrix",
    category: "Learning-to-rank search engine",
    description:
      "A two-stage retrieval and re-ranking system combining first-pass lexical retrieval with ML relevance ranking and semantic signals.",
    impact:
      "Designed for production-style search where ranking quality, speed, and explainable relevance all matter.",
    stack: ["Tantivy", "LightGBM", "LambdaRank", "SentenceTransformers", "Modal", "DINO"],
  },
  {
    title: "Deep Search MCP Backend",
    category: "LibreChat research tooling",
    description:
      "An MCP backend with tools for web search, paper search, page and PDF fetching, batch operations, email delivery, and PDF creation.",
    impact:
      "Supports router, planner, researcher, writer, and tool-selector agents in a multi-agent research workflow.",
    stack: ["MCP", "LibreChat", "Python", "Search APIs", "PDF tools", "Email tools"],
  },
  {
    title: "AI Competition Judgment",
    category: "AI evaluation assistant",
    description:
      "A Streamlit system for judging hackathon submissions through body-language analysis, speech transcription, content evaluation, and RAG.",
    impact:
      "Produces structured judging insights, PDF reports, and searchable team evaluation history.",
    stack: ["Streamlit", "YOLO", "SQLite", "ChromaDB", "RAG", "PDF reports"],
  },
  {
    title: "AI Deal-Finding System",
    category: "Autonomous e-commerce ranking",
    description:
      "An AI system that scans deals, estimates product value, ranks opportunities, validates structured outputs, and sends alerts.",
    impact:
      "Combines retrieval, product intelligence, and ranking into a practical shopping intelligence workflow.",
    stack: ["RAG", "ChromaDB", "Llama", "PyTorch", "Modal"],
  },
  {
    title: "Horus AI",
    category: "Ancient Egypt artifact guide",
    description:
      "An AI-powered artifact explorer with image classification, generated historical descriptions, tourism recommendations, and a Gemini assistant.",
    impact:
      "Makes cultural discovery interactive through vision, language generation, and personalized guidance.",
    stack: ["Python", "Flask", "Keras", "Gemini API", "Computer Vision"],
  },
];

export const EXPERIENCE = [
  {
    role: "AI Engineer Intern",
    company: "Areeb Technology",
    duration: "Feb 2026 - May 2026",
    location: "Cairo, Egypt - Hybrid",
    details: [
      "Built AI-driven solutions, search systems, and intelligent backends.",
      "Worked on learning-to-rank, semantic search, GPU-backed workflows, and deep-search agent tooling.",
    ],
  },
  {
    role: "Artificial Intelligence Trainee",
    company: "National Telecommunication Institute",
    duration: "Oct 2025 - Jan 2026",
    location: "Egypt",
    details: [
      "Completed a 540+ hour Ready to Hire AI Diploma covering ML, deep learning, NLP, computer vision, cloud integration, and deployment.",
      "Graduated with a 95% score after delivering an AI competition judging project.",
    ],
  },
  {
    role: "Backend Developer Intern",
    company: "Numinix / Lexmodo",
    duration: "Mar 2025 - Sep 2025",
    location: "Alexandria, Egypt",
    details: [
      "Developed backend services in Go for e-commerce platforms and internal admin systems.",
      "Supported QA, QC, documentation, README writing, and live website delivery.",
    ],
  },
  {
    role: "IBM Data Science Track",
    company: "DEPI",
    duration: "Oct 2024 - May 2025",
    location: "Egypt",
    details: [
      "Worked with IBM data science tooling, machine learning, exploratory analysis, and visualization.",
      "Achieved 1st place in the program final project competition.",
    ],
  },
];

export const SKILL_GROUPS = [
  {
    title: "LLM and Agents",
    skills: ["RAG", "Embeddings", "Prompt Engineering", "LangChain", "LangGraph", "CrewAI", "MCP", "Google ADK"],
  },
  {
    title: "AI and Data",
    skills: ["PyTorch", "TensorFlow", "Hugging Face", "QLoRA", "Scikit-learn", "Pandas", "NumPy", "ChromaDB"],
  },
  {
    title: "Backend and Cloud",
    skills: ["Python", "FastAPI", "Go", "Node.js", "Docker", "REST APIs", "GCP", "Cloud Run", "Modal"],
  },
  {
    title: "Databases and BI",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Data Warehousing", "ETL", "Power BI", "Tableau"],
  },
];

export const EDUCATION = {
  school: "Alexandria University",
  degree: "B.Sc. in Software Industry and Multimedia",
  graduation: "2025",
  grade: "Excellent with Honors",
  project:
    "Dwa2y, a cross-platform mobile donation platform for medicines and medical equipment built with Node.js, Flutter, MongoDB, and Mongoose.",
};
