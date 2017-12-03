import React from "react"
import PropTypes from "prop-types"
import jsonp from "jsonp"

const getAjaxUrl = url => url.replace('/post?', '/post-json?')

class MailchimpSubscribeForm extends React.Component {
  constructor(props, ...args) {
    super(props, ...args)
    this.state = {
      status: null,
      msg: null,
    }

    this.onSubmit = this.onSubmit.bind(this);

  }
  onSubmit (e) {
    e.preventDefault()
    if (!this.input.value || this.input.value.length < 5 || this.input.value.indexOf("@") === -1) {
      this.setState({
        status: "error",
      })
      return
    }
    const url = getAjaxUrl(this.props.action) + `&EMAIL=${encodeURIComponent(this.input.value)}`;
    this.setState(
      {
        status: "sending",
        msg: null,
      }, () => jsonp(url, {
        param: "c",
      }, (err, data) => {
        if (err) {
          this.setState({
            status: 'error',
            msg: err,
          })
        } else if (data.result !== 'success') {
          this.setState({
            status: 'error',
            msg: data.msg,
          })
        } else {
          this.setState({
            status: 'success',
            msg: data.msg,
          })
        }
      })
    )
  }
  render() {
    const { action, messages, className, containerStyle, styles } = this.props
    const { status, msg } = this.state
    return (
      <div className={className} style={containerStyle}>
        <form action={action} method="post" noValidate>
          <input
            ref={node => (this.input = node)}
            type="email"
            defaultValue=""
            name="EMAIL"
            required={true}
            placeholder={messages.inputPlaceholder}
          />
          <input
            disabled={this.state.status === "sending"}
            onClick={this.onSubmit}
            type="submit"
            value={messages.btnLabel}
          />
          <div className="message">
            {status === "sending" && <p style={styles.sending} dangerouslySetInnerHTML={{ __html: messages.sending }} />}
            {status === "success" && <p style={styles.success} dangerouslySetInnerHTML={{ __html: messages.success || msg }} />}
            {status === "error" && <p style={styles.error} dangerouslySetInnerHTML={{ __html: messages.error || msg }} />}
          </div>
        </form>
      </div>
    )
  }
}

MailchimpSubscribeForm.propTypes = {
  action: PropTypes.string,
  messages: PropTypes.object,
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  styles: PropTypes.object,
}

MailchimpSubscribeForm.defaultProps = {
  messages: {
    inputPlaceholder: "Votre email",
    btnLabel: "Envoyer",
    sending: "Envoi en cours...",
    success: "Merci de votre intérêt!<p>Nous devons confirmer votre adresse e-mail. Pour compléter le processus d'abonnement, veuillez cliquer sur le lien contenu dans l'e-mail que nous venons de vous envoyer.</p>",
    error: "Oops, impossible d'enregistrer cette adresse",
  },
  styles: {
    sending: {
    },
    success: {
      color: "green",
    },
    error: {
      color: "red",
    },
  },
}

export default MailchimpSubscribeForm
