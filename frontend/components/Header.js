import React, { Component } from 'react'

export default class Header extends Component {
    render() {
        retutn (
            <header>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/chat'>Chat</Link></li>
                        <li><Link to='/delirious-generator'>Delirious-generator</Link></li>
                        <li><Link to='/test'>Test</Link></li>
                    </ul>
                </nav>
            </header>
        );
    }
};
