import React from 'react';
import './App.css';

function App() {
  return (
    <div className="page">
      <form className='form'>
        <section className='input-block'>
          <header>
            <h1>Mortgage Calculator</h1>
            <button>Clear All</button>
          </header>
          <div>
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
          <footer>
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
