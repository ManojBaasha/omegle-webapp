import React from 'react';

function Welcome({ setIsLoading }) {
  const handleButtonClick = () => {
    setIsLoading(true);
  };

  return (
    <div>
      <h1 style={{ fontWeight: 'bold' }}>Hello World from Welcome Screen</h1>
      <button onClick={handleButtonClick}>Set Loading to True</button>
    </div>
  );
}

export default Welcome;
