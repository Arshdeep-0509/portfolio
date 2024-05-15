import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Software Developer",
    icon: web,
  },
  {
    title: "Frontend Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "React.js Developer",
    company_name: "Techdoc Labs",
    // icon: starbucks,
    iconBg: "#383E56",
    date: "Oct 2022 - Jan 2022",
    points: [
      "Architected an Admin Dashboard for an ecommerce sneakers website, streamlining management and analytics functionalities.",
      "Engineered Organization Management in MERN stack, facilitating user and admin level interactions for efficient workflow",
      "Conducted API integration in React, seamlessly connecting with Node for enhanced functionality and data communication.",
      "Implemented a Traffic Control System in React and Node, incorporating both technology and manual Black Box testing methodologies.",
      "Orchestrated the integration of the Razorpay Payment Gateway and CC Avenue,ensuring secure and efficient financial transactions within the system.",
    ],
  },
  {
    title: "Frontend Developer",
    company_name: "Indian Institute of Technolgy",
    // icon: tesla,
    iconBg: "#E6DEDD",
    date: "May 2023 - Oct 2023",
    points: [
      " Pioneered virtual labs for Machine Learning and Artificial Neural Networks , advancing experiential learning in these dynamic fields. ",
      " Engineered animated simulations, elevating virtual labs with immersive and engaging educational experiences",
      "Leveraging Canvas in JavaScript, actively enhancing digital platforms for optimal interactivity and user experience",
    ],
  },

  {
    title: "Software Developer",
    company_name: "Kintop Pictures- Ziliit",
    // icon: meta,
    iconBg: "#E6DEDD",
    date: "June 2023 - Present",
    points: [
      " Innovated a pre-production module featuring a dynamic weekly calendar and a badge system, fostering enhanced project planning, resource allocation, and organizational efficiency, optimizing film production timelines and deliverables",
      " Leveraged AWS S3 bucket for secure file uploads, implementing role-based access controls, ensuring stringent document management, confidentiality, and data integrity, bolstering robust film management processes and mitigating cyber threats",
      " Implemented AES Algorithm for enhanced security, encrypting messages and headers throughout film management processes, prioritizing data integrity, confidentiality, and protection against cyber threats, ensuring secure communication and document handling. ",
      " Enhanced admin and profile settings with localization techniques, bolstering application accessibility and user satisfaction, optimizing user experience and facilitating seamless navigation across diverse linguistic preferences.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Car Rent",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
