
import { useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function Options() {
    useEffect(() => {
       console.log('hello');
       console.log('world');
    }
    , []);

  return (
    <h1>
      hello world
    </h1>
  );
}

export default Options;

createRoot(document.getElementById('root')!).render(
<StrictMode>
    <Options />
</StrictMode>
);
