import React, { Component } from 'react'
import Nav from './Nav.js'

export default class App extends Component {
    render() {
        return (
            <div id="">
                <Nav/>
                <main>
                    <div>
                        <article id="ArticleSection">
                            <section id="section_1">
                                <div>
                                    <div class="Window" id="app">
                                        <div class="Content" id="main_app">
                                            {this.props.children}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section id="section_2">
                                <div></div>
                            </section>
                            <section id="section_3">
                                <div></div>
                            </section>
                        </article>
                    </div>
                </main>
            </div>
        );
    }
};