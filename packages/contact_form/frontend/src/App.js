import './App.css';

import { useState, useEffect, useRef } from 'react';

function CheckboxInputGroup(props) {
  const {
    label,
    name,
    value,
    required,
    onChange,
    errorMessage,
    hasError: initialHasError
  } = props;
  const [hasError, setHasError] = useState(initialHasError);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    const inputElement = inputRef.current;
    inputElement.addEventListener('invalid', () => setHasError(true));
    inputElement.addEventListener('change', () => setHasError(false));
  }, []);

  return (
    <div className='checkbox-input-group'>
      <div className='checkbox-input-group__main'>
        <input
          id={name}
          name={name}
          checked={value}
          onChange={onChange}
          required={required}
          className='checkbox-input-group__input'
          type='checkbox'
          ref={inputRef}
        />
        <label htmlFor={name} className={'checkbox-input-group__label' + (required ? ' checkbox-input-group__label--required' : '')}>
          {label}
        </label>
      </div>
      {hasError && <p className='input-group__error-message'>{errorMessage}</p>}
    </div>
  );
}

function InputGroup(props) {
  const {
    label,
    name,
    type = 'text',
    required = false,
    value,
    onChange,
    hasError: initialHasError = false,
  } = props;
  const errorMessage = 'This field is required';
  const [hasError, setHasError] = useState(initialHasError);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    const inputElement = inputRef.current;
    inputElement.addEventListener('invalid', () => setHasError(true));
    inputElement.addEventListener('change', () => { setHasError(false) });
  }, []);

  return (
    <div className='input-group'>
      <label className={'input-group__label' + (required ? ' input-group__label--required' : '')} htmlFor={name}>
        {label}
      </label>
      {
        type === 'textarea'
          ? (<textarea
            id={name}
            className={'input-group__textarea' + (hasError ? ' input-group__input--error' : '')}
            name={name}
            value={value}
            required={required}
            onChange={onChange}
            ref={inputRef}
          />)
          : (<input
            id={name}
            className={'input-group__input' + (hasError ? ' input-group__input--error' : '')}
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            ref={inputRef}
          />)
      }
      {hasError && <p className='input-group__error-message'>{errorMessage}</p>}
    </div>
  );
}

function RadioInputGroup(props) {
  const {
    label,
    value,
    name,
    required,
    radioItems,
    onChange,
    hasError: initialHasError = false,
  } = props;
  const errorMessage = 'This field is required';
  const [hasError, setHasError] = useState(initialHasError);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    const inputElement = inputRef.current;
    inputElement.addEventListener('invalid', () => setHasError(true));
    inputElement.addEventListener('change', () => { setHasError(false) });
  }, []);

  return (
    <fieldset className='radio-input-group'>
      <legend className={'radio-input-group__group-label' + (required ? ' radio-input-group__group-label--required' : '')}>
        {label}
      </legend>
      <ul className='radio-input-list'>
        {radioItems.map(({ label: radioLabel, value: radioValue }) => (
          <li className={'radio-input-list__item' + (value === radioValue ? ' radio-input-list__item--active' : '')}>
            <input
              className='radio-input-group__input'
              type='radio'
              id={radioLabel}
              name={name}
              value={radioValue}
              onChange={onChange}
              checked={value === radioValue}
              required={required}
              ref={inputRef}
            />
            <label className='radio-input-group__label' htmlFor={radioLabel}>
              {radioLabel}
            </label>
          </li>
        ))}
      </ul>
      {hasError && <p>{errorMessage}</p>}
    </fieldset>
  );
}
function Toast() {
  return (
    <div className='toast'>
      <header className='toast__header'>
        <img src='./assets/images/icon-success-check.svg' alt="message sent icon" />
        <p>Message Sent!</p>
      </header>
      <p className='toast__content'>
        Thanks for completing the form. We'll be in touch soon!
      </p>
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({});
  const [isFormSent, setIsFormSent] = useState(false);

  function handleSendForm(e) {
    const { form: formElement } = e.target;
    e.preventDefault();
    if (formElement.reportValidity()) {
      setIsFormSent(true);
    }
  }

  return (
    <div className='page'>
      <form className='contact-form'>
        <header className='contact-form__header'>
          <h1>Contact Us</h1>
        </header>
        <div className='contact-form__content'>
          <div className='input-block'>
            <InputGroup
              label="First Name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <InputGroup
              label="Last Name"
              name="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <InputGroup
            label="Email Address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <RadioInputGroup
            label="Query Type"
            required
            radioItems={[
              { label: 'General Inquiry', value: 'general_inquiry' },
              { label: 'Support Request', value: 'support_request' },
            ]}
            onChange={({ target: { value } }) => setFormData({ ...formData, queryType: value })}
            value={formData.queryType}
          />
          <InputGroup
            label="Message"
            name="message"
            type="textarea"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <CheckboxInputGroup
            label="I consent to being contacted by the team"
            errorMessage="To submit this form, please consent to being contacted"
            required
            name="canBeContacted"
            value={formData.canBeContacted}
            onChange={({ target: { checked } }) => setFormData({ ...formData, canBeContacted: checked })}
          />
        </div>
        <output>
          {JSON.stringify(formData)}
        </output>
        <footer className='contact-form__footer'>
          <button className='button' type='submit' onClick={handleSendForm}>Submit</button>
        </footer>
      </form>
      {isFormSent && <Toast />}
    </div>
  );
}

export default App;
