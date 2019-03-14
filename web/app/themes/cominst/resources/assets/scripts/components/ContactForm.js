import React from "react";

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

const ContactForm = () => (
  <div>
    <p>
      <a className="link-icon link-email">{window.appData.i18n.contactUs}</a>
    </p>
    <Modal isOpen style={modalStyles} contentLabel="Contact Form">
      <input type="text" name="name" placeholder="Name" />
      <input type="text" name="email" placeholder="Email" />
      <input type="text" name="subjet" placeholder="Subject" />
      <textarea name="message" placeholder="Message" />
    </Modal>
  </div>
);

export default ContactForm;
