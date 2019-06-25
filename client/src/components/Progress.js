import React from "react";
import Proptypes from "prop-types";

const Progress = ({ percentage }) => {
  return (
    <div className="progress mt-3">
      <div
        className="progress-bar progress-bar-striped"
        role="progressbar"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
};

Progress.propTypes = {
  percentage: Proptypes.number.isRequired
};

export default Progress;
