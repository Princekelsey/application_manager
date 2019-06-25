import React from "react";
import PropTypes from "prop-types";

const RecordDisplay = ({ formData, handleEdit }) => {
  const formDetails = formData.map(data => (
    <li
      key={data.occupation}
      className="list-group-item list-group-horizontal-sm"
    >
      <div className="d-flex justify-content-around ">
        <p>Form Submission Successful</p>
        <a href={data.application} className="btn btn-sm btn-primary">
          Download Uploaded File
        </a>
      </div>
    </li>
  ));
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Form Details
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {" "}
            {formData.length ? (
              <ul className="list-group  ">{formDetails}</ul>
            ) : (
              <p className="text-center">Please complete the form</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEdit}
              data-dismiss="modal"
            >
              Edit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RecordDisplay.propTypes = {
  formData: PropTypes.array.isRequired,
  handleEdit: PropTypes.func
};

export default RecordDisplay;
