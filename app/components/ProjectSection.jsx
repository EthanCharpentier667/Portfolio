"use client";
import React, { useState, useRef } from "react";
import ProjectCards from './ProjectCards'
import { motion, useInView } from "framer-motion";
import ProjectTag from "./ProjectTag";

const projectData = [
    {
        id: 1,
        title: "My Radar",
        description: "MY RADAR is a 2D air traffic simulation game where planes and control towers come to life on screen. Planes follow set paths, take off, land, or collide, while control towers manage safe zones. The project offers real-time visuals and interactive features, providing an engaging way to explore air traffic dynamics.",
        image: "/images/projects/1.png",
        tag: ["All", "Game"],
        gitUrl: "/",
        previewUrl: "/"
    },
    {
        id: 2,
        title: "My Sudo",
        description: "A 1st year Epitech project which consists of creating a Linux command in C language. This command allows any user authorized to use it to have all permissions on the compute",
        image: "/images/projects/2.png",
        tag: ["All", "App"],
        gitUrl: "/",
        previewUrl: "/"
    },
    {
        id: 3,
        title: "Wolf3D",
        description: "A 1st year Epitech project which consists of reproctuce wolf3D with CSFML LIB in C language. The project is a 3D game where you can move in a 3D world, shoot enemies and collect items.",
        image: "/images/projects/3.png",
        tag: ["All", "Game"],
        gitUrl: "/",
        previewUrl: "/launcher"
    },
    {
        id: 4,
        title: "Web portfolio",
        description: "My Web Portfolio using react so next JS.",
        image: "/images/projects/4.png",
        tag: ["All", "Web"],
        gitUrl: "/",
        previewUrl: "/"
    },
    {
        id: 5,
        title: "Obake",
        description: "My first 42 hours game jam project finished. In the theme of illusion, our game proposes to find it. A 3D game made with Unity where you have 5 min and small clues to find the illusion.",
        image: "/images/projects/5.png",
        tag: ["All", "Game"],
        gitUrl: "https://github.com/EthanCharpentier667/Obake",
        previewUrl: "/launcher"
    },
    {
        id: 6,
        title: "Launcher",
        description: "This project is a launcher for all the games I created. It allows you to download theses game and launch them directly from the launcher.",
        image: "/images/projects/6.png",
        tag: ["All", "App"],
        gitUrl: "https://github.com/EthanCharpentier667/Launcher",
        previewUrl: "/launcher"
    }
];

function ProjectSection() {

    const [tag, setTag] = useState("All");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const handleTagChange = (newTag) => {
        setTag(newTag);
    };

    const filteredProjects = projectData.filter((project) =>
        project.tag.includes(tag)
    );

    const cardVariants = {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
    };
    

  return (
    <section>
        <div className='mt-40'>
            <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
                My Projects
            </h2>
        <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
            <ProjectTag
            onClick={handleTagChange}
            name="All"
            isSelected={tag === "All"}
            />
            <ProjectTag
            onClick={handleTagChange}
            name="App"
            isSelected={tag === "App"}
            />
            <ProjectTag
            onClick={handleTagChange}
            name="Web"
            isSelected={tag === "Web"}
            />
            <ProjectTag
            onClick={handleTagChange}
            name="Game"
            isSelected={tag === "Game"}
            />
      </div>
        <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
            {filteredProjects.map((project, index) => (
            <motion.li
                key={index}
                variants={cardVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
                transition={{ duration: 0.3, delay: index * 0.4 }}
            >
            <ProjectCards
                key={project.id}
                title={project.title}
                description={project.description}
                imgUrl={project.image}
                gitUrl={project.gitUrl}
                previewUrl={project.previewUrl}
            />
            </motion.li>
            ))}
      </ul>
        </div>

    </section>
  )
}

export default ProjectSection