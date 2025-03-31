"use client";
import React from 'react'
import Link from "next/link";

import { TypeAnimation } from 'react-type-animation';

const HeroSection = () => {
  return (
    <section>
        <div className='place-content-center'>
            <div className="col-span-4 place-self-center text-center sm:text-left">
                <h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Hello, I'm {" "}
                    </span>
                    <br></br>
                    <TypeAnimation
                    sequence={[
                        'Ethan',
                        2000,
                        'An Epitech Student',
                        2000,
                        'a C and C# developper',
                        2000,
                        'and more..',
                        1000
                    ]}
                    wrapper="span"
                    speed={20}
                    repeat={Infinity}
                    />
                </h1>
                <p className='text-[#c8d0d6] text-base sm:text-lg mb-6 lg:text-xl'>
                    Welcome to my portfolio
                </p>
                <div>
                <Link
                    href="#about-section"
                    className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:bg-slate-200 text-white"
                >
                    About me
                </Link>
                <Link
                    href="/cv-ethan-charpentier.pdf"
                    className='px-6 py-3 w-full sm:w-fit rounded-full mr-4 bg-transparent hover:bg-slate-800 text-white border border-white mt-3'
                >
                    Download CV
                </Link>
                </div>
            </div>
        </div>
        <div className='col-span-5'></div>
    </section>
  )
}

export default HeroSection