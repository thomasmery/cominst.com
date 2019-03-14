import React, { useState } from "react";
import PropTypes from "prop-types";
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

var formSchema = yup.object().shape({
  name: yup.string().required(window.appData.i18n.fieldIsRequired),
  email: yup
    .string()
    .email(window.appData.i18n.emailIsNotValid)
    .required(window.appData.i18n.fieldIsRequired),
  subject: yup.string(),
  message: yup.string().required(window.appData.i18n.fieldIsRequired),
});

const ContactForm = ({ shouldCloseModal }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    nonce: window.appData.contactFormNonce,
  });
  const [isMessageSent, setIsMessageSent] = useState(false);

  const getError = fieldName => {
    const filteredErrors = errors.filter(error => error.path === fieldName);
    if (filteredErrors.length) {
      return filteredErrors[0].message;
    }
    return null;
  };

  // we want to close the modal from higher up in some cases
  if (shouldCloseModal && isModalOpen) {
    setModalOpen(false);
  }

  return (
    <div>
      <p>
        <a
          className="link-icon link-email"
          onClick={() => {
            setMessage("");
            setIsMessageSent(false);
            setModalOpen(true);
          }}
        >
          {window.appData.i18n.contactUs}
        </a>
      </p>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        shouldCloseOnOverlayClick={false}
        contentLabel="Contact Form"
        className="contact-form__content"
        overlayClassName="contact-form__overlay"
      >
        <span className="close-button" onClick={() => setModalOpen(false)}>
          <svg
            width="29px"
            height="29px"
            viewBox="0 0 29 29"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs />
            <g
              id="expand-button-container"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
              strokeLinecap="square"
            >
              <g stroke="#018EC0" strokeWidth="2">
                <path d="M0,13 L27,13" />
                <path d="M14,27 L14,0" />
              </g>
            </g>
          </svg>
        </span>
        <form
          action=""
          onSubmit={e => {
            e.preventDefault();
            setMessage(window.appData.i18n.sending);
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
                    if (response.data === "success") {
                      setIsMessageSent(true);
                      setMessage(window.appData.i18n.messageSent);
                      setFormData(
                        Object.assign({}, formData, {
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        })
                      );
                    }
                  })
                  .catch(function(error) {
                    console.log(error); // eslint-disable-line
                    setMessage(window.appData.i18n.errorSendingEmail);
                  });
              })
              .catch(ValidationError => {
                setMessage(window.appData.i18n.correctErrors);
                setErrors(ValidationError.inner);
              });
          }}
        >
          <div style={{ display: isMessageSent ? "none" : "block" }}>
            <div className="form-group">
              <label htmlFor="name">
                {window.appData.i18n.name}
                <sup>*</sup>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={e => {
                  setMessage("");
                  setErrors([]);
                  setFormData(
                    Object.assign({}, formData, { name: e.currentTarget.value })
                  );
                }}
                className="form-control input-name"
                placeholder={window.appData.i18n.EnterYourName}
              />
              <p className="error-message">{getError("name")}</p>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={e => {
                  setMessage("");
                  setErrors([]);
                  setFormData(
                    Object.assign({}, formData, {
                      email: e.currentTarget.value,
                    })
                  );
                }}
                className="form-control input-email"
                placeholder={window.appData.i18n.EnterYourEmail}
              />
              <p className="error-message">{getError("email")}</p>
            </div>
            <div className="form-group">
              <label htmlFor="subject">
                {window.appData.i18n.messageSubject}
              </label>
              <input
                name="subject"
                value={formData.subject}
                onChange={e => {
                  setMessage("");
                  setErrors([]);
                  setFormData(
                    Object.assign({}, formData, {
                      subject: e.currentTarget.value,
                    })
                  );
                }}
                className="form-control input-subject"
                placeholder={window.appData.i18n.EnterTheMessageSubject}
              />
              <p className="error-message">{getError("email")}</p>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={e => {
                  setMessage("");
                  setErrors([]);
                  setFormData(
                    Object.assign({}, formData, {
                      message: e.currentTarget.value,
                    })
                  );
                }}
                className="form-control input-message"
                rows="4"
                placeholder={window.appData.i18n.EnterYourMessage}
              />
              <p className="error-message">{getError("message")}</p>
            </div>
            <button type="submit">{window.appData.i18n.send}</button>
          </div>
          <p className="message">{message}</p>
        </form>
      </Modal>
    </div>
  );
};

ContactForm.propTypes = {
  shouldCloseModal: PropTypes.bool,
};

ContactForm.defaultProps = {
  shouldCloseModal: false,
};

export default ContactForm;
