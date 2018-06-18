import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NotFound extends Component {
    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        Page not found. Go to <Link to='/'>home</Link>?
                    </div>
                </div>
            </div>
        );
    };
};
