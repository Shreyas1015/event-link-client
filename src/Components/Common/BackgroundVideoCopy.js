import React from "react";

const BackgroundVideoCopy = () => {
  return (
    <>
      <video
        className="position-absolute z-n1 background-video"
        autoPlay
        muted
        loop
        style={{ width: "74%" }}
        src="/Images/videoplayback.webm"
      ></video>
    </>
  );
};

export default BackgroundVideoCopy;
