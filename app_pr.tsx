import React from 'react';

interface AppProps {
    // Add your props here
}

const App: React.FC<AppProps> = () => {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Natours API</h1>
            </header>
            <main>
                {/* Add your main content components here */}
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Natours API</p>
            </footer>
        </div>
    );
};

export default App;</div>