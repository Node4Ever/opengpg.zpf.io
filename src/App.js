import React from 'react';
import { Container } from 'reactstrap';


import './App.css';

class App extends React.Component {
    // Initialize state
    state = { }

    // Determine if user is logged in or not.
    componentDidMount() {
        this.setState({
            isLoggedIn: Auth.isUserAuthenticated(),
        });
    }

    render() {

        return (
        <Container>
            <section className="App">
                <div>
                    <h1>MindStream Journal</h1>
                    <div><img src="/logo.png" title="Node4Ever GPG Speaker" alt="Node4Ever GPG Speaker" width="250" height="250" /></div>
                    <nav>
                        <a href="/">Symmetric</a> |
                    </nav>
                </div>
            </section>
        </Container>
        );
    }
}

export default App;
