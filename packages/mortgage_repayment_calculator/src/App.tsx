import React, { useEffect, useRef, useState } from 'react';
import './App.css';


// UTILS
function getCurrencyFormattedNumber(number: number): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }).format(number);
}

// Components
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
  hasError?: boolean,
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
    hasError: initialHasError,
    ...partialProps
  } = props;

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
    <div className='input-group'>
      <label className='input-group__label' htmlFor={name}>{label}</label>
      <div className={['input-group__input-container', hasError ? 'input-group__input-container--error' : ''].filter(v => v).join(' ')}>
        {prefixSlot && <div className={['input-group__input-slot', hasError ? 'input-group__input-slot--error' : ''].filter(v => v).join(' ')}>{prefixSlot}</div>}
        <input
          className='input-group__input'
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          {...partialProps}
          ref={inputRef}
        />
        {suffixSlot && <div className={['input-group__input-slot', hasError ? 'input-group__input-slot--error' : ''].filter(v => v).join(' ')}>{suffixSlot}</div>}
      </div>
      {hasError && <p className='input-group__error'>This field is required</p>}
    </div>
  );
}

interface OutputBlockProps {
  formData: FormData;
}
function OutputBlock({ formData }: OutputBlockProps) {
  const {
    amount,
    durationInYears,
    interestRate,
    mortgageType,
    isFormSent,
  } = formData;
  // principal -- borrowed amount
  // anual interest -- percentage of principal
  // total -- principal + interest

  // Interest Amount
  const principal = Number.parseFloat(amount);
  const anualInterestRateInPercent = Number.parseInt(interestRate, 10) / 100;
  const anualInterestAmount = principal * anualInterestRateInPercent;

  // Total Payment
  const loanTermInYears = Number.parseInt(durationInYears, 10);
  const totalInterestAmount = anualInterestAmount * loanTermInYears;
  const totalRepayment = totalInterestAmount + principal;

  // Monthly payments
  const loanTermInMonths = loanTermInYears * 12;

  const monthlyAmount = mortgageType === 'repayment'
    ? totalRepayment / loanTermInMonths
    : totalInterestAmount / loanTermInMonths;

  const totalAmount = mortgageType === 'repayment'
    ? totalRepayment
    : totalInterestAmount;

  const formatedMonthlyRepayment = getCurrencyFormattedNumber(monthlyAmount);
  const formatedTotalRepayment = getCurrencyFormattedNumber(totalAmount);

  return (
    <section className='output-block'>
      {
        !isFormSent
          ? (
            <div className='empty-output'>
              <img src='./assets/images/illustration-empty.svg' />
              <h2>Results shown here</h2>
              <p className='output-text'>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
            </div>
          )
          : (
            <div className='output-section'>
              <h2>Your results</h2>
              <p className='output-text'>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>
              <div className='output-card'>
                <h3 className='output-card__title'>Your mounthly repayments</h3>
                <output className='output output--big output--accent'>{formatedMonthlyRepayment}</output>
                <div className='separator'></div>
                <h3 className='output-card__title'>Total you'll repay over the term</h3>
                <output className='output'>{formatedTotalRepayment}</output>
              </div>
            </div>
          )
      }
    </section>
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
  mortgageType: string;
  isFormSent: boolean;
}
const initialFormData: FormData = {
  amount: '',
  durationInYears: '',
  interestRate: '',
  mortgageType: '',
  isFormSent: false,
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  function handleResetForm() {
    setFormData(initialFormData);
  }
  function handleSubmitForm(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    const button = e.target as HTMLButtonElement;
    if (button.form?.checkValidity()) {
      setFormData({ ...formData, isFormSent: true });
    }
  }

  return (
    <div className="page">
      <form className='form'>
        <section className='input-block'>
          <header className='input-block__header'>
            <h1 className='heading'>Mortgage Calculator</h1>
            <Button buttonType='ghost' onClick={handleResetForm}>Clear All</Button>
          </header>
          <div className='input-block__body'>
            <InputGroup
              label="Mortgage Amount"
              value={formData.amount}
              type='number'
              onChange={({ target: { value } }) => setFormData({ ...formData, amount: value })}
              prefixSlot={<p>$</p>}
              required
            />
            <div className='input-pair'>
              <InputGroup
                label="Mortgage Term"
                value={formData.durationInYears}
                type='number'
                onChange={({ target: { value } }) => setFormData({ ...formData, durationInYears: value })}
                suffixSlot={<p>years</p>}
                required
              />
              <InputGroup
                label="Interest Rate"
                value={formData.interestRate}
                type='number'
                onChange={({ target: { value } }) => setFormData({ ...formData, interestRate: value })}
                suffixSlot={<p>%</p>}
                required
              />
            </div>
            <RadioInputGroup
              label='Mortgage Type'
              radioItems={radioItems}
              value={formData.mortgageType.toString()}
              onChange={({ target: { value } }) => setFormData({ ...formData, mortgageType: value })}
              required
            />
          </div>
          <footer className='input-block__footer'>
            <Button type='submit' buttonType='primary' onClick={handleSubmitForm}>
              <div className='button-text-icon'>
                <img src='./assets/images/icon-calculator.svg' alt='calculator icon' />
                <span>Calculate Repayments</span>
              </div>
            </Button>
          </footer>
        </section>
        <OutputBlock formData={formData} />
      </form>
    </div>
  );
}

export default App;
