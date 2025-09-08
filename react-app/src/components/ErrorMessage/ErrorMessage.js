import './ErrorMessage.css'

function ErrorMessage({errorMessage}) {
    return (
      <div className="errorTitle">
        Oops, something went wrong.
        <div className="errorMessage">
            {errorMessage}
        </div>
        <div className="errorMessage">
          Click anywhere to exit.
        </div>
      </div>
    );
  }
  
  export default ErrorMessage;
  