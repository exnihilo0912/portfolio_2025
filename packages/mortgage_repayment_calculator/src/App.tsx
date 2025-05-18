import React, { useEffect, useRef, useState } from 'react';
import './App.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: 'default' | 'primary' | 'ghost';
}
function Button(props: ButtonProps) {
  const {
    children,
    type = 'button',
    buttonType = 'default',
    ...partialProps
  } = props;
  const classesAsText = [
    'button',
    buttonType !== 'default' ? `button--${buttonType}` : '',
  ].filter((v) => v).join(' ');
  return (
    <button className={classesAsText} type={type} {...partialProps}>{children}</button>
  );
}
interface RadioItem {
  label: string;
  value: any;
}
interface RadioInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label: string;
  radioItems: RadioItem[];
  hasError?: boolean;
}
function RadioInputGroup(props: RadioInputProps) {
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
    const inputElement = inputRef.current as HTMLInputElement;
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

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  value: string;
  onChange: (event: any) => void;
  label: string;
  prefixSlot?: React.ReactNode;
  suffixSlot?: React.ReactNode;
}
function InputGroup(props: InputProps) {
  const {
    type,
    value,
    onChange,
    name,
    label,
    prefixSlot,
    suffixSlot,
  } = props;


  
  return (
    <div className='input-group'>
      <label className='input-group__label' htmlFor={name}>{label}</label>
      <div className='input-group__input-container'>
        {prefixSlot && <div className='input-group__input-slot'>{prefixSlot}</div>}
        <input
          className='input-group__input'
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
        />
        {suffixSlot && <div className='input-group__input-slot'>{suffixSlot}</div>}
      </div>
    </div>
  );
}

const radioItems: RadioItem[] = [
  {
    label: 'Repayment',
    value: 'repayment',
  },
  {
    label: 'Interest Only',
    value: 'interest-only',
  },
];

interface FormData {
  amount: string;
  durationInYears: string;
  interestRate: string;
}
const initialFormData: FormData = {
  amount: '',
  durationInYears: '',
  interestRate: '',
};

function App() {
  const [formData, setFormData] = useState(initialFormData);

  return (
    <div className="page">
      <form className='form'>
        <section className='input-block'>
          <header className='input-block__header'>
            <h1 className='heading'>Mortgage Calculator</h1>
            <Button buttonType='ghost'>Clear All</Button>
          </header>
          <div className='input-block__body'>
            <InputGroup
              label="Mortgage Amount"
              value={formData.amount}
              type='number'
              onChange={({ target: { value } }) => setFormData({ ...formData, amount: value })}
              prefixSlot={<p>$</p>}
            />
            <InputGroup
              label="Mortgage Term"
              value={formData.durationInYears}
              type='number'
              onChange={({ target: { value } }) => setFormData({ ...formData, durationInYears: value })}
              suffixSlot={<p>years</p>}
            />
            <InputGroup
              label="Interest Rate"
              value={formData.interestRate}
              type='number'
              onChange={({ target: { value } }) => setFormData({ ...formData, interestRate: value })}
              suffixSlot={<p>%</p>}
            />
            <RadioInputGroup label='Mortgage Type' radioItems={radioItems} />
          </div>
          <footer className='input-block__footer'>
            <Button type='submit' buttonType='primary'>Calculate Repayments</Button>
          </footer>
        </section>
        <section className='output-block'>
          <div className='empty-output'>
            <img src='./assets/images/illustration-empty.svg' />
            <h2>Results shown here</h2>
            <p>Complete the form and click "calculate repayments: to see what your monthly repayments would be.</p>
          </div>
          <div className=''>
            <h2>Your results</h2>
            <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>
            <div className='output-card'>
              <h3>Your mounthly repayments</h3>
              <output className='output'></output>
              <div className='separator'></div>
              <h3>Total you'll repay over the term</h3>
              <output className='output'></output>
            </div>
          </div>
          <p>output</p>
        </section>
      </form>
    </div>
  );
}

export default App;
