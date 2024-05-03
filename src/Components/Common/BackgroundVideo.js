import React from "react";

const BackgroundVideo = (props) => {
  return (
    <>
      <video
        className="position-absolute z-n1 background-video"
        autoPlay
        muted
        loop
        src="/Images/videoplayback.webm"
      ></video>
    </>
  );
};

export default BackgroundVideo;
