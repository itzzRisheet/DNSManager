import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import illustration1 from "../assets/illustration1.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useGSAP(() => {
    gsap.fromTo(".hero-cont-1", { opacity: 0 }, { opacity: 1, duration: 1 });
  });

  //   useEffect(() => {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   });

  //   if (loading) {
  //     return (
  //       <div className="absoute flex flex-col items-center justify-center top-0 left-0 h-screen w-screen bg-main">
  //         <Loading />
  //       </div>
  //     );
  //   }

  return (
    <div className="flex flex-col items-center justify-center  h-screen w-screen overflow-auto bg-main">
      <div
        id="container"
        className="h-4/6 w-5/6 flex flex-col  lg:flex-row gap-[2rem] p-4"
      >
        <div className="hero-cont-1 h-full w-full lg:w-3/5 ">
          <img
            src={illustration1}
            className="h-full w-full content-evenly"
          ></img>
        </div>
        <div className="hero-cont-1  text-white text-center flex flex-col items-center justify-center ">
          <div className="max-w-2xl mx-auto  bg-opacity-75  rounded-lg">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to DNS Manager
            </h1>
            <p className="text-base md:text-lg mb-6">
              Manage your DNS settings with ease. Simplify your domain
              configurations and ensure your services run smoothly.
            </p>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                navigate("/login");
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
