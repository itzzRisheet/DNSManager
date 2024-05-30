import React from "react";
import "./loading.css";

const LoadingList = () => {
  return (
    <div class="typing-indicator">
      <div class="typing-circle"></div>
      <div class="typing-circle"></div>
      <div class="typing-circle"></div>
      <div class="typing-shadow"></div>
      <div class="typing-shadow"></div>
      <div class="typing-shadow"></div>
    </div>
  );
};

export default LoadingList;
