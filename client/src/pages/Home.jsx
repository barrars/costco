import { useState, useEffect } from 'react';

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the fullstack app!</p>
      {data && <p>Data from server: {JSON.stringify(data)}</p>}
    </div>
  );
}

export default Home;