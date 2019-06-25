import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import classnames from "classnames";
import { storage } from "../firebase";
import Progress from "./Progress";
import Message from "./Message";
import RecordDisplay from "./RecordDisplay";

const Form = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState([]);
  const [formObject, setFormObject] = useState({});
  const [fileInfo, setFileInfo] = useState({
    name: "Choose Application File",
    url: ""
  });
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [occupation, setOccupation] = useState("");
  const [occupations, setOccupations] = useState([]);
  const [percentage, setProgress] = useState(0);
  const [uploadMsg, setUploadMsg] = useState("");
  const [editing, setEditing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    application: ""
  });

  // Make a get request to the database to the list of  all occupation data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/occupation")
      .then(res => {
        setOccupations(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  // File change method to get the file name and data
  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setFileInfo({ ...fileInfo, name: e.target.files[0].name });
  };

  // File upload method
  const handleUpload = e => {
    e.preventDefault();

    // check if there is a file
    if (!file) {
      setUploadMsg("No file Uploaded");

      // if there is a file, upload the file to firebase and get the download URL
    } else {
      setUploaded(true);
      const uploadTask = storage.ref(`files/${file.name}`).put(file);
      uploadTask.on(
        "state_changed",
        snapshot => {
          //  file upload progress funnction
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        err => {
          //error function
          setUploadMsg("Error Uploading File");
          console.log(err);
        },
        () => {
          // complete function
          storage
            .ref("files")
            .child(file.name)
            .getDownloadURL()
            .then(url => {
              setFileInfo({ ...fileInfo, url });
              setUploadMsg("File Uploaded");
            });
        }
      );
    }
  };

  // Validation function to check for errors while filling the form
  const validate = () => {
    let isError = false;
    const errors = {};
    if (name.firstName === "") {
      isError = true;
      errors.firstName = "First name is required";
    }
    if (name.lastName === "") {
      isError = true;
      errors.lastName = "Last name is required";
    }
    if (occupation === "") {
      isError = true;
      errors.occupation = "Please choose an occupation";
    }
    if (uploaded === false) {
      isError = true;
      errors.application =
        "Application file is required (Please click on upload if already selected a file)";
    }
    if (isError) {
      setErrors({ ...errors, ...errors });
    }
    return isError;
  };

  // form submit function
  const handleSubmit = e => {
    e.preventDefault();
    const err = validate();
    // check if there is error in the form before submiting
    if (!err) {
      setUploaded(true);
      // get the form datas
      let newfile = {
        application_id: Math.floor(100000 + Math.random() * 900000),
        first_Name: name.firstName,
        last_Name: name.lastName,
        occupation,
        application: fileInfo.url,
        filename: fileInfo.name
      };

      const updated = [newfile];
      setFormObject({ ...newfile, formObject });
      setFormData(updated);

      // make a post request to the server
      axios
        .post("http://localhost:5000/api/newData", newfile)
        .then(res => console.log(res.data))
        .catch(error => console.log(error));
    }

    if (uploaded === true) {
      setName({ ...name, firstName: "", lastName: "" });
      setOccupation("");
      setFileInfo({ name: "Choose Application File" });
      setProgress(0);
    }
  };

  // form update function
  const handleUpdate = e => {
    e.preventDefault();
    setEditing(false);

    // set file datas
    let newFile = {
      first_Name: name.firstName,
      last_Name: name.lastName,
      occupation,
      application: fileInfo.url
    };

    const updated = [newFile];
    setFormObject({ ...newFile, formObject });
    setFormData(updated);

    // make a post request to the server to update form data
    axios
      .post(
        `http://localhost:5000/api/edit/${formObject.application_id}`,
        newFile
      )
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    setName({ ...name, firstName: "", lastName: "" });
    setOccupation("");
    setFileInfo({ name: "Choose Application File" });
    setProgress(0);
  };

  // Function to set the form state to editing and load the form data
  const handleEdit = () => {
    setName({
      ...name,
      firstName: formObject.first_Name,
      lastName: formObject.last_Name
    });
    setOccupation(formObject.occupation);

    setEditing(true);
  };

  // iterate through the occupation list loaded from the database to display them on the form
  const options = occupations.map(occupation => (
    <option key={occupation.Code} value={occupation.Name}>
      {occupation.Name}
    </option>
  ));

  return (
    <Fragment>
      <h6 className="display-4 text-center mb-4 pt-1">Application Form</h6>
      {uploadMsg ? <Message msg={uploadMsg} /> : null}
      <div className="row justify-content-center">
        <div className="col-sm-6 ">
          <div className="card card-body my-3  ">
            <form>
              <div className="input-group">
                <div className="input-group-prepend">
                  <div className="input-group-text bg-dark text-white">
                    <i className="fas fa-file-signature" />
                  </div>
                </div>
                <input
                  type="text"
                  className={classnames("form-control form-control-sm ", {
                    "is-invalid": errors.firstName
                  })}
                  placeholder="First Name"
                  value={name.firstName}
                  onChange={e =>
                    setName({ ...name, firstName: e.target.value })
                  }
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>
              <div className="input-group pt-3">
                <div className="input-group-prepend">
                  <div className="input-group-text bg-dark text-white">
                    <i className="fas fa-file-signature" />
                  </div>
                </div>
                <input
                  type="text"
                  className={classnames("form-control form-control-sm ", {
                    "is-invalid": errors.lastName
                  })}
                  placeholder="Last Name"
                  value={name.lastName}
                  onChange={e => setName({ ...name, lastName: e.target.value })}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
              <div className="form-group pt-2">
                <label> Select Occupation</label>
                <select
                  className={classnames("form-control form-control-sm ", {
                    "is-invalid": errors.occupation
                  })}
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                >
                  {options}
                </select>
                {errors.occupation && (
                  <div className="invalid-feedback">{errors.occupation}</div>
                )}
              </div>

              <div className="custom-file">
                <input
                  type="file"
                  className={classnames("custom-file-input", {
                    "is-invalid": errors.application
                  })}
                  onChange={handleFileChange}
                />

                <label className="custom-file-label" htmlFor="customFile">
                  {fileInfo.name}
                </label>
                {errors.application && (
                  <div className="invalid-feedback">{errors.application}</div>
                )}
              </div>

              {<Progress percentage={percentage} />}
              <input
                onClick={handleUpload}
                type="submit"
                value="upload"
                className="btn btn-dark btn-sm mt-3"
              />
            </form>
            {editing === false ? (
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary btn-sm btn-block mt-4 "
                data-toggle="modal"
                data-target="#exampleModal"
              >
                SUBMIT
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                type="submit"
                className="btn btn-primary btn-sm btn-block mt-4 "
                data-toggle="modal"
                data-target="#exampleModal"
              >
                UPDATE
              </button>
            )}
          </div>
        </div>
      </div>

      <RecordDisplay
        formData={formData}
        formObject={formObject}
        handleEdit={handleEdit}
      />
    </Fragment>
  );
};

export default Form;
