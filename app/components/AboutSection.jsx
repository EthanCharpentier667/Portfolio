"use client"
import React, { useTransition, useState } from 'react'
import TabButton from "./TabButton";

const TAB_DATA = [
    {
        title: "Skills",
        id: "skills",
        content: (
            <ul className='list-disc pl-2'>
                <li>C#</li>
                <li>C</li>
                <li>Python</li>
                <li>Html / JavaScrpt</li>
                <li>CSS</li>
                <li>React JavaScrpt</li>
            </ul>
        )
    }, 
    {
        title: "Education",
        id: "education",
        content: (
            <ul className='list-disc pl-2'>
                <li>St Joseph du Loquidy</li>
                <li>Epitech First Year</li>
                <li>Eugène Livet</li>
            </ul>
        )
    }
]

const AboutSection = () => {
    const [tab, setTab] = useState("skills");
    const [isPending, startTransition] = useTransition();

    const handleTabChange = (id) => {
        startTransition(() => {
            setTab(id);
        });
    };

  return (
    <section id="about-section" className='text-white'>
        <div className='items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16'>
            <div className='mt-4 md:mt-0 text-left flex flex-col h-full'>
                <h2 className='text-4xl font-bold text-white mb-4'>About Me</h2>
                <p className='text-base lg:text-lg'>
                I am a first-year student at Epitech Nantes, where I am honing my skills in programming,
                artificial intelligence, and system analysis.
                Passionate about emerging technologies,
                I focus on projects that push the boundaries of innovation and aim to 
                create a positive impact on society. My approach to development is driven 
                by the pursuit of both technical and ethical solutions, with the goal of contributing to
                a future where technology can improve our daily lives in a sustainable way. Curious, self-driven,
                and determined, I am eager to collaborate on ambitious projects where every 
                line of code can make a difference.
                </p>
                <div className='flex flex-row justify-start mt-8'>
                    <TabButton
                        seletTab={() => handleTabChange("skills")}
                        active={tab === "skills"}
                    >
                        {" "}
                        Skills{" "}
                    </TabButton>
                    <TabButton 
                        seletTab={() => handleTabChange("education")}
                        active= {tab === "education"}
                    >
                        {" "}
                        Education{" "}
                     </TabButton>
                </div>
                <div className='mt-5'>{TAB_DATA.find((t) => t.id === tab).content}</div>
            </div>
        </div>
    </section>
  )
}

export default AboutSection