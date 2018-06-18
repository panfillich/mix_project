import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Nav extends Component {
    render() {
        return (

        <header>
            <div><a href=""></a>
                <h1>Doc2vec / word2vec</h1>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/chat'>Chat</Link></li>
                        <li><Link to='/generator'>Generator</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
        );
    }
};

