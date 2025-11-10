
import type { RoleData } from './types';

export const ROLES: { [key: string]: RoleData } = {
  backend: {
    label: "Backend Engineer",
    skills: ["Java", "Python", "Go", "Node.js", "SQL", "Data Structures & Algorithms", "System Design", "APIs", "Caching", "Microservices"],
    rounds: [
      { name: "R1", focus: "Coding & Algorithms", mins: 60, eval: "Correctness, complexity, clarity" },
      { name: "R2", focus: "System Design", mins: 60, eval: "Architecture, scalability, trade-offs" },
      { name: "R3", focus: "Behavioral & Culture Fit", mins: 45, eval: "Communication, teamwork, ownership" }
    ],
    skillMap: {
      "Java": "core", "Python": "core", "Go": "core", "Node.js": "core", "SQL": "core", "APIs": "core", "Caching": "core",
      "Data Structures & Algorithms": "algo",
      "System Design": "system", "Microservices": "system"
    }
  },
  frontend: {
    label: "Frontend Engineer",
    skills: ["JavaScript", "TypeScript", "React", "Vue", "Angular", "Accessibility", "Performance", "Testing", "CSS", "Build Tools"],
    rounds: [
      { name: "R1", focus: "UI Coding Challenge", mins: 60, eval: "Accuracy, state mgmt, semantics" },
      { name: "R2", focus: "Frontend Architecture", mins: 45, eval: "Design patterns, performance, DX" },
      { name: "R3", focus: "Behavioral & Culture Fit", mins: 45, eval: "Communication, product thinking" }
    ],
     skillMap: {
      "JavaScript": "core", "TypeScript": "core", "React": "core", "Vue": "core", "Angular": "core", "CSS": "core", "Build Tools": "core",
      "Testing": "algo",
      "Performance": "system", "Accessibility": "system"
    }
  },
  datasci: {
    label: "Data Scientist",
    skills: ["Python", "R", "SQL", "Statistics", "ML Modeling", "Feature Engineering", "Experimentation", "Data Visualization"],
    rounds: [
      { name: "R1", focus: "Coding & SQL", mins: 45, eval: "Correctness, clarity, data handling" },
      { name: "R2", focus: "Machine Learning Case Study", mins: 60, eval: "Problem framing, metrics, bias/variance" },
      { name: "R3", focus: "Behavioral & Stakeholder Comms", mins: 45, eval: "Communication, trade-offs" }
    ],
    skillMap: {
        "Python": "core", "R": "core", "SQL": "core", "Feature Engineering": "core", "Data Visualization": "core",
        "Statistics": "algo",
        "ML Modeling": "system", "Experimentation": "system"
    }
  },
  devops: {
    label: "DevOps / SRE",
    skills: ["Linux", "Networking", "Containers", "Kubernetes", "Observability", "CI/CD", "Infrastructure as Code", "Scripting"],
    rounds: [
      { name: "R1", focus: "Hands-on Troubleshooting", mins: 60, eval: "Troubleshooting, shell, fundamentals" },
      { name: "R2", focus: "Infrastructure Design", mins: 60, eval: "Scalability, HA, trade-offs" },
      { name: "R3", focus: "On-call & Incident Response", mins: 45, eval: "Incidents, comms, ownership" }
    ],
     skillMap: {
        "Linux": "core", "Networking": "core", "Containers": "core", "Scripting": "core",
        "CI/CD": "algo",
        "Kubernetes": "system", "Observability": "system", "Infrastructure as Code": "system"
    }
  },
  qa: {
    label: "QA / Test Engineer",
    skills: ["Test Design", "Automation Frameworks", "API Testing", "Performance Testing", "SDET Principles", "CI/CD Integration"],
    rounds: [
      { name: "R1", focus: "Automation Coding", mins: 60, eval: "Design, reliability, maintainability" },
      { name: "R2", focus: "Test Strategy & Scenarios", mins: 45, eval: "Coverage, risk, non-functional" },
      { name: "R3", focus: "Collaboration & Culture", mins: 30, eval: "Dev collaboration, CI, ownership" }
    ],
    skillMap: {
        "Test Design": "core", "Automation Frameworks": "core", "API Testing": "core",
        "SDET Principles": "algo",
        "Performance Testing": "system", "CI/CD Integration": "system"
    }
  }
};

export const SENIORITY_WEIGHTS = {
  junior: { core: 0.4, algo: 0.4, system: 0.1, culture: 0.1 },
  mid: { core: 0.35, algo: 0.25, system: 0.25, culture: 0.15 },
  senior: { core: 0.25, algo: 0.15, system: 0.4, culture: 0.2 }
};
