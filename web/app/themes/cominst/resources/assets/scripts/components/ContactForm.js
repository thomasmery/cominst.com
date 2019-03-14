import React, { useState } from "react";
import axios from "axios";
import qs from "qs";
import * as yup from "yup";

import Modal from "react-modal";

if (window.document.getElementById("app")) {
  Modal.setAppElement("#app");
}

if (window.document.getElementById("contact-form-container")) {
  Modal.setAppElement("#contact-form-container");
}

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

var formSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  subject: yup.string(),
  message: yup.string().required(),
});

const ContactForm = () => {
  const [isModalopen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    nonce: window.appData.contactFormNonce,
  });

  return (
    <div>
      <p>
        <a className="link-icon link-email" onClick={() => setModalOpen(true)}>
          {window.appData.i18n.contactUs}
        </a>
      </p>
      <Modal
        isOpen={isModalopen}
        style={modalStyles}
        contentLabel="Contact Form"
      >
        <span onClick={() => setModalOpen(false)}>Close</span>
        <form
          action=""
          onSubmit={e => {
            e.preventDefault();

            console.log("submit", formData); // eslint-disable-line

            formSchema
              .validate(formData, {
                abortEarly: false,
              })
              .then(() => {
                axios
                  .post(
                    window.appData.ajaxUrl,
                    qs.stringify({
                      formData,
                      nonce: formData.nonce,
                      action: "cominst_contact_form",
                    })
                  )
                  .then(function(response) {
                    console.log(response); // eslint-disable-line
                    setMessage(response.data);
                  })
                  .catch(function(error) {
                    console.log(error); // eslint-disable-line
                  });
              })
              .catch(ValidationError => {
                console.log(ValidationError); // eslint-disable-line
              });
          }}
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={e =>
                setFormData(
                  Object.assign({}, formData, { name: e.currentTarget.value })
                )
              }
              className="form-control input-name"
              placeholder="Enter Your Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={e =>
                setFormData(
                  Object.assign({}, formData, { email: e.currentTarget.value })
                )
              }
              className="form-control input-email"
              placeholder="Enter Your Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={e =>
                setFormData(
                  Object.assign({}, formData, {
                    message: e.currentTarget.value,
                  })
                )
              }
              className="form-control input-message"
              rows="4"
              placeholder="Enter Your Message"
            />
            <br />
          </div>
          <button type="submit">{window.appData.i18n.send}</button>
        </form>
        <p>{message}</p>
      </Modal>
    </div>
  );
};

export default ContactForm;
