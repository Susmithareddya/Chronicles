import { Story } from "@/components/StoryCard";
import { StoryTileService } from "@/services/storyTileService";

// Create a singleton instance of the story tile service
const storyTileService = new StoryTileService();

export const storiesData: { [key: string]: Story[] } = {
  "Onboarding Essentials": [
    {
      id: "onb-1",
      title: "Team Introduction Protocol",
      description: "Step-by-step guide for introducing new team members to key stakeholders and establishing initial relationships.",
      status: "complete",
      date: "2024-01-15",
      tags: ["onboarding", "team", "process"],
      author: "Christopher B."
    },
    {
      id: "onb-2", 
      title: "Product Development Workflow",
      description: "Comprehensive overview of our product development cycle, from ideation to launch, including key decision points.",
      status: "complete",
      date: "2024-01-22",
      tags: ["workflow", "product", "development"],
      author: "Christopher B."
    },
    {
      id: "onb-3",
      title: "Stakeholder Mapping Guide",
      description: "Visual guide to understanding internal and external stakeholders, their priorities, and communication preferences.",
      status: "complete",
      date: "2024-02-01",
      tags: ["stakeholders", "communication", "mapping"],
      author: "Christopher B."
    },
    {
      id: "onb-4",
      title: "Decision-Making Framework",
      description: "Framework for making product decisions, including escalation paths and approval processes for different scenarios.",
      status: "complete",
      date: "2024-02-10",
      tags: ["decisions", "framework", "process"],
      author: "Christopher B."
    },
    {
      id: "onb-5",
      title: "Cultural Norms & Expectations",
      description: "Unwritten rules and cultural expectations within the product team and broader organization.",
      status: "progress",
      date: "2024-02-15",
      tags: ["culture", "norms", "expectations"],
      author: "Christopher B."
    }
  ],
  "Project Histories": [
    {
      id: "proj-1",
      title: "Platform Migration Initiative",
      description: "Complete story of migrating our legacy system to cloud infrastructure, including challenges faced and lessons learned.",
      status: "complete",
      date: "2023-06-15",
      tags: ["migration", "infrastructure", "cloud"],
      author: "Christopher B."
    },
    {
      id: "proj-2",
      title: "Mobile App Launch Strategy",
      description: "Strategic approach and execution details for launching our first mobile application across iOS and Android platforms.",
      status: "complete",
      date: "2023-08-20",
      tags: ["mobile", "launch", "strategy"],
      author: "Christopher B."
    },
    {
      id: "proj-3",
      title: "API Gateway Implementation",
      description: "Technical and business considerations for implementing a unified API gateway to improve system integration.",
      status: "complete",
      date: "2023-09-12",
      tags: ["api", "gateway", "integration"],
      author: "Christopher B."
    },
    {
      id: "proj-4",
      title: "Customer Portal Redesign",
      description: "User research insights and design decisions that led to a 40% increase in customer satisfaction scores.",
      status: "complete",
      date: "2023-11-08",
      tags: ["redesign", "ux", "customer"],
      author: "Christopher B."
    },
    {
      id: "proj-5",
      title: "Analytics Platform Integration",
      description: "Implementation story of our data analytics platform and how it transformed decision-making processes.",
      status: "complete",
      date: "2024-01-05",
      tags: ["analytics", "data", "integration"],
      author: "Christopher B."
    }
  ],
  "Crisis Management": [
    {
      id: "crisis-1",
      title: "Q3 2023 System Outage Response",
      description: "Detailed account of how we managed a critical system failure that affected 85% of our user base during peak hours.",
      status: "complete",
      date: "2023-07-22",
      tags: ["outage", "response", "emergency"],
      author: "Christopher B."
    },
    {
      id: "crisis-2",
      title: "Security Breach Incident Management",
      description: "Step-by-step response to a data security incident, including communication strategy and remediation steps.",
      status: "complete",
      date: "2023-09-05",
      tags: ["security", "breach", "incident"],
      author: "Christopher B."
    },
    {
      id: "crisis-3",
      title: "Supply Chain Disruption Mitigation",
      description: "How we navigated global supply chain challenges and maintained product delivery commitments to customers.",
      status: "complete",
      date: "2023-11-30",
      tags: ["supply-chain", "disruption", "mitigation"],
      author: "Christopher B."
    },
    {
      id: "crisis-4",
      title: "Key Personnel Departure Protocol",
      description: "Framework for managing sudden departures of critical team members while maintaining project continuity.",
      status: "complete",
      date: "2024-01-18",
      tags: ["personnel", "departure", "continuity"],
      author: "Christopher B."
    },
    {
      id: "crisis-5",
      title: "Product Recall Coordination",
      description: "Comprehensive approach to managing a product quality issue that required coordinated recall efforts.",
      status: "complete",
      date: "2024-02-08",
      tags: ["recall", "quality", "coordination"],
      author: "Christopher B."
    },
    {
      id: "crisis-6",
      title: "Market Downturn Strategy Pivot",
      description: "Strategic decisions and tactical adjustments made during economic uncertainty to protect market position.",
      status: "complete",
      date: "2024-02-25",
      tags: ["market", "strategy", "pivot"],
      author: "Christopher B."
    },
    {
      id: "crisis-7",
      title: "Regulatory Compliance Crisis",
      description: "Managing unexpected regulatory changes and ensuring rapid compliance across all product lines.",
      status: "progress",
      date: "2024-03-01",
      tags: ["regulatory", "compliance", "crisis"],
      author: "Christopher B."
    },
    {
      id: "crisis-8",
      title: "Communication Strategy Templates",
      description: "Templates and frameworks for crisis communication with different stakeholder groups during emergencies.",
      status: "incomplete",
      date: "2024-03-10",
      tags: ["communication", "templates", "crisis"],
      author: "Christopher B."
    }
  ],
  "Strategic Partnerships": [
    {
      id: "part-1",
      title: "Global Supplier Agreement Framework",
      description: "Negotiation strategy and terms that established our partnership with key international suppliers.",
      status: "complete",
      date: "2023-05-12",
      tags: ["suppliers", "global", "framework"],
      author: "Christopher B."
    },
    {
      id: "part-2",
      title: "Technology Partnership Evaluation",
      description: "Criteria and process for evaluating potential technology partnerships, including due diligence frameworks.",
      status: "complete",
      date: "2023-07-08",
      tags: ["technology", "partnership", "evaluation"],
      author: "Christopher B."
    },
    {
      id: "part-3",
      title: "Joint Venture Success Metrics",
      description: "Key performance indicators and success metrics established for strategic joint venture relationships.",
      status: "complete",
      date: "2023-09-20",
      tags: ["joint-venture", "metrics", "success"],
      author: "Christopher B."
    },
    {
      id: "part-4",
      title: "Vendor Management Best Practices",
      description: "Lessons learned from managing multiple vendor relationships and optimizing partnership performance.",
      status: "complete",
      date: "2023-11-15",
      tags: ["vendor", "management", "practices"],
      author: "Christopher B."
    },
    {
      id: "part-5",
      title: "Contract Renegotiation Strategies",
      description: "Successful approaches to renegotiating existing contracts to improve terms and reduce costs.",
      status: "complete",
      date: "2024-01-30",
      tags: ["contracts", "renegotiation", "strategy"],
      author: "Christopher B."
    }
  ],
  "Strategy Lessons": [
    {
      id: "strat-1",
      title: "Market Entry Strategy Analysis",
      description: "Comprehensive analysis of our entry into new geographic markets, including successes and failures.",
      status: "complete",
      date: "2023-04-20",
      tags: ["market-entry", "analysis", "geographic"],
      author: "Christopher B."
    },
    {
      id: "strat-2",
      title: "Competitive Positioning Framework",
      description: "Framework for analyzing competitive landscape and positioning our products for maximum market advantage.",
      status: "complete",
      date: "2023-06-30",
      tags: ["competitive", "positioning", "framework"],
      author: "Christopher B."
    },
    {
      id: "strat-3",
      title: "Product Portfolio Optimization",
      description: "Strategic decisions around product line rationalization and portfolio optimization for improved profitability.",
      status: "complete",
      date: "2023-08-15",
      tags: ["portfolio", "optimization", "profitability"],
      author: "Christopher B."
    },
    {
      id: "strat-4",
      title: "Customer Segmentation Strategy",
      description: "Data-driven approach to customer segmentation that improved targeting and increased conversion rates.",
      status: "complete",
      date: "2023-10-10",
      tags: ["segmentation", "targeting", "conversion"],
      author: "Christopher B."
    },
    {
      id: "strat-5",
      title: "Pricing Strategy Evolution",
      description: "Evolution of our pricing strategy across different market conditions and competitive pressures.",
      status: "complete",
      date: "2023-12-05",
      tags: ["pricing", "strategy", "evolution"],
      author: "Christopher B."
    },
    {
      id: "strat-6",
      title: "Long-term Vision Planning",
      description: "Process for developing and communicating long-term strategic vision across the organization.",
      status: "complete",
      date: "2024-02-12",
      tags: ["vision", "planning", "long-term"],
      author: "Christopher B."
    },
    {
      id: "strat-7",
      title: "Market Research Methodologies",
      description: "Proven methodologies for conducting market research that informs strategic decision-making.",
      status: "complete",
      date: "2024-02-28",
      tags: ["research", "methodology", "market"],
      author: "Christopher B."
    },
    {
      id: "strat-8",
      title: "Strategic Planning Process",
      description: "Annual strategic planning process including stakeholder input, scenario planning, and goal setting.",
      status: "complete",
      date: "2024-03-05",
      tags: ["planning", "process", "goals"],
      author: "Christopher B."
    },
    {
      id: "strat-9",
      title: "Innovation Pipeline Management",
      description: "Framework for managing innovation initiatives from ideation through commercialization.",
      status: "progress",
      date: "2024-03-12",
      tags: ["innovation", "pipeline", "management"],
      author: "Christopher B."
    },
    {
      id: "strat-10",
      title: "Risk Assessment Framework",
      description: "Comprehensive framework for identifying, assessing, and mitigating strategic risks.",
      status: "progress",
      date: "2024-03-15",
      tags: ["risk", "assessment", "framework"],
      author: "Christopher B."
    },
    {
      id: "strat-11",
      title: "Stakeholder Alignment Strategy",
      description: "Strategies for maintaining alignment among diverse stakeholders during strategic initiatives.",
      status: "incomplete",
      date: "2024-03-18",
      tags: ["stakeholder", "alignment", "strategy"],
      author: "Christopher B."
    },
    {
      id: "strat-12",
      title: "Performance Measurement Systems",
      description: "Design and implementation of KPIs and measurement systems for strategic initiatives.",
      status: "incomplete",
      date: "2024-03-20",
      tags: ["performance", "measurement", "kpis"],
      author: "Christopher B."
    }
  ],
  "Innovation & Technology": [
    {
      id: "tech-1",
      title: "R&D Investment Strategy",
      description: "Framework for prioritizing R&D investments and balancing innovation with operational needs.",
      status: "complete",
      date: "2023-05-25",
      tags: ["r&d", "investment", "strategy"],
      author: "Christopher B."
    },
    {
      id: "tech-2",
      title: "Technology Adoption Framework",
      description: "Systematic approach to evaluating and adopting new technologies across the organization.",
      status: "complete",
      date: "2023-07-18",
      tags: ["technology", "adoption", "framework"],
      author: "Christopher B."
    },
    {
      id: "tech-3",
      title: "AI Integration Roadmap",
      description: "Strategic roadmap for integrating artificial intelligence capabilities into existing product lines.",
      status: "complete",
      date: "2023-09-30",
      tags: ["ai", "integration", "roadmap"],
      author: "Christopher B."
    },
    {
      id: "tech-4",
      title: "Digital Transformation Lessons",
      description: "Key learnings from our digital transformation journey, including organizational change management.",
      status: "complete",
      date: "2023-11-22",
      tags: ["digital", "transformation", "change"],
      author: "Christopher B."
    },
    {
      id: "tech-5",
      title: "Innovation Culture Development",
      description: "Initiatives and practices implemented to foster innovation culture within the organization.",
      status: "complete",
      date: "2024-01-08",
      tags: ["innovation", "culture", "development"],
      author: "Christopher B."
    },
    {
      id: "tech-6",
      title: "Future Technology Trends",
      description: "Analysis of emerging technology trends and their potential impact on our industry and business model.",
      status: "complete",
      date: "2024-02-20",
      tags: ["trends", "future", "analysis"],
      author: "Christopher B."
    },
    {
      id: "tech-7",
      title: "Patent Strategy Framework",
      description: "Intellectual property strategy for protecting innovations while enabling collaborative development.",
      status: "complete",
      date: "2024-03-01",
      tags: ["patents", "ip", "strategy"],
      author: "Christopher B."
    },
    {
      id: "tech-8",
      title: "Technology Partnership Evaluation",
      description: "Criteria and process for evaluating technology partnerships and joint development opportunities.",
      status: "progress",
      date: "2024-03-08",
      tags: ["technology", "partnerships", "evaluation"],
      author: "Christopher B."
    },
    {
      id: "tech-9",
      title: "Innovation Metrics & KPIs",
      description: "Measurement framework for tracking innovation performance and return on R&D investments.",
      status: "incomplete",
      date: "2024-03-15",
      tags: ["metrics", "kpis", "innovation"],
      author: "Christopher B."
    },
    {
      id: "tech-10",
      title: "Emerging Technology Assessment",
      description: "Systematic approach to assessing and piloting emerging technologies for potential adoption.",
      status: "incomplete",
      date: "2024-03-22",
      tags: ["emerging", "assessment", "pilot"],
      author: "Christopher B."
    }
  ]
};

// Helper function to get stories for a category (including dynamic ones)
export const getStoriesForCategory = (categoryTitle: string): Story[] => {
  const staticStories = storiesData[categoryTitle] || [];
  return storyTileService.getStoriesForCategory(categoryTitle, staticStories);
};

// Helper function to calculate status counts
export const calculateStatusCounts = (stories: Story[]) => {
  return stories.reduce(
    (acc, story) => {
      acc[story.status]++;
      return acc;
    },
    { complete: 0, progress: 0, incomplete: 0 }
  );
};

// Export the story tile service for use in components
export { storyTileService };