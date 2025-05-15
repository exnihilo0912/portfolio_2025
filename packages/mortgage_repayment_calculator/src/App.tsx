import React, { useState } from 'react';
import './App.css';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  value: string;
  onChange: (event: any) => void;
  label: string;
}
function InputGroup(props: InputProps) {
  const {
    type,
    value,
    onChange,
    name,
    label,
  } = props;

  return (
    <div className='input-group'>
      <label className='input-group__label' htmlFor={name}>{label}</label>
      <input
        className='input-group__input'
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

interface FormData {
  amount: string,
}
const initialFormData: FormData = {
  amount: '',
};

function App() {
  const [formData, setFormData] = useState(initialFormData);

  return (
    <div className="page">
      <form className='form'>
        <section className='input-block'>
          <header className='input-block__header'>
            <h1 className='heading'>Mortgage Calculator</h1>
            <button>Clear All</button>
          </header>
          <div className='input-block__body'>
            <InputGroup
              label="Mortgage Amount"
              value={formData.amount}
              onChange={({ target: { value } }) => setFormData({ ...formData, amount: value })}
            />
            <div>
              <label>Mortgage Amount</label>
              <input />
            </div>
            <div>
              <label>Mortgage Term</label>
              <input />
            </div>
            <div>
              <label>Interest Rate</label>
              <input />
            </div>
            <fieldset>
              <legend>Mortgage Type</legend>
              <div>
                <label>Repayment</label>
                <input type='radio' />
              </div>
              <div>
                <label>Interest Only</label>
                <input type='radio' />
              </div>
            </fieldset>
          </div>
          <footer className='input-block__footer'>
            <button>Calculate Repayments</button>
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
