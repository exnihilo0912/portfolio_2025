import './App.css';

function InputGroup({ label, type = 'text', required = false }) {
  const errorMessage = 'This field is required';

  return (
    <div className='input-group'>
      <label className='input-group__label'>
        {label}
      </label>
      {
        type === 'textarea'
          ? <textarea className='input-group__input' />
          : <input className='input-group__input' type={type} />
      }
      <p>{errorMessage}</p>
    </div>
  );
}


function App() {
  return (
    <div className='page'>
      <form className='contact-form'>
        <header className='contact-form__header'>
          <h1>Contact Us</h1>
        </header>
        <div className='contact-form__content'>
          <div className='input-block'>
            <InputGroup label="First Name" required={true} />
            <InputGroup label="Last Name" required={true} />
          </div>
          <InputGroup label="Email Address" type="email" required={true} />
          <fieldset>
            <legend>Query Type</legend>
            <ul className='radio-input-list'>
              <li className='radio-input-list__item'>
                <input className='radio-input-group__input' type='radio' />
                <label className='radio-input-group__label'>
                  General Inquiry
                </label>
              </li>
              <li className='radio-input-list__item'>
                <input className='radio-input-group__input' type='radio' />
                <label className='radio-input-group__label'>
                  Support Request
                </label>
              </li>
            </ul>
          </fieldset>
          <InputGroup label="Message" type="textarea" required={true} />
          <label className='input-group'>
            <input className='input-group__input' type='checkbox' />
            <span className='input-group__label'>I consent to being contacted by the team</span>
          </label>
        </div>
        <footer className='contact-form__footer'>
          <button className='button' type='submit'>CTA</button>
        </footer>
      </form>
      <div className='toast'>
        <header className='toast__header'>
          Message Sent!
        </header>
        <p className='toast__content'>
          Thanks for completing the form. We'll be in touch soon!
        </p>
      </div>
    </div>
  );
}

export default App;
