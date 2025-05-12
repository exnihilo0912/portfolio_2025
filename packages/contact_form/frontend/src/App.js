import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="page">
      <form className='contact-form'>
        <header className='contact-form__header'>
          <h1>Contact Us</h1>
        </header>
        <div className='contact-form__content'>
          <div className='input-block'>
            <label className='input-group'>
              <span className='input-group__label'>first name</span>
              <input className='input-group__input' type='text' />
              {/* error message */}
            </label>
            <label className='input-group'>
              <span className='input-group__label'>last name</span>
              <input className='input-group__input' type='text' />
            </label>
          </div>
          <label className='input-group'>
            <span className='input-group__label'>email address</span>
            <input className='input-group__input' type='text' />
          </label>
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
          <label className='input-group'>
            <span className='input-group__label'>Message</span>
            <textarea />
          </label>
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
