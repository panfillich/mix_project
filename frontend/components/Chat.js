import React, { Component } from 'react'
import socket from '../socket'

export default class Chat extends Component {

    constructor(props){
        super(props);

        this.state = {
            messages: []
        };
        this.message_field = null;
        this.textarea = null;
        this.sendUserMessage = this.sendUserMessage.bind(this); //
        this.getBotMessage = this.getBotMessage.bind(this);
        socket.subscribe('message', this.getBotMessage);
    }

    sendUserMessage() {
        const text = this.textarea.value;

        this.state.messages.push({
            sender:'user',
            text:text
        });

        if(this.textarea.scrollTo) {
            this.textarea.scrollTo(0, 10);
        }
        this.textarea.value = '';
        this.textarea.focus();
        socket.client.emit('message', text);

        this.setState((prevState) => {
            return {};
        });
    }

    getBotMessage(data) {
        this.state.messages.push({
            sender:'bot',
            text:data
        });

        this.textarea.scrollTo(0, 10);
        this.textarea.value = '';
        this.textarea.focus();

        this.setState((prevState) => {
            // console.log(prevState);
            return {};
        });
    }

    componentDidUpdate(){
        this.message_field.scrollTo(0, this.message_field.scrollHeight);
    }

    render() {
        let html_messages = [];

        this.state.messages.forEach(function (message) {
            html_messages.push(
                <li className="list-group-item justify-content-between">
                    {message.sender} : {message.text}
                </li>
            );
        });
        return (
            <div id="chat">
                <div class="FirstSection">
                    <div class="FirstSectionBody">
                        <div class="TextAreaSection">
                            <div>
                                <textarea
                                    ref = {(input)=>{this.textarea=input;}}
                                    onKeyDown={(e)=>{if(e.keyCode==13){
                                        this.sendUserMessage();
                                    }}}
                                >
                                    Привет
                                </textarea>
                            </div>
                        </div>
                        <div class="ButtonSection">
                            <div>
                                <div>
                                    <button onClick={this.sendUserMessage}>Send</button>
                                </div>
                                <div>
                                    <button>Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="SecondSection chat-widget" ref={(elem)=>{this.message_field=elem;}}
                     style={{"overflow-y":"auto"}}
                >
                    <div class="SecondSectionBody">
                        <ul class="list-group">
                            {html_messages}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
};