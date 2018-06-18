import React, { Component } from 'react'
import socket from '../socket'

export default class Generator extends Component {

    constructor(props){
        super(props);

        this.generator_text = null;
        this.original_text = null;
        this.user_text = null;
        this.user_tone = null;

        this.sendUserText = this.sendUserText.bind(this);
        this.getGeneratorText = this.getGeneratorText.bind(this);
        socket.subscribe('generator', this.getGeneratorText);
    }

    sendUserText(){
        socket.client.emit('generator',{
            ton:this.user_tone.value,
            text:this.user_text.value
        });
        this.original_text.innerHTML = '<b>Оригинал</b><br />' +  this.user_text.value;
        this.user_text.value = '';
    }

    getGeneratorText(data){
        this.generator_text.innerHTML = '<b>Генератор</b><br />' + data;
    }

    render() {
        return (
            <div id="chat">

                <div
                    ref={(elem)=>{this.message_field=elem;}}
                    className="chat-widget"
                    style={{
                    "margin-top":"7px", "margin-bottom":"7px",
                    "border":"1px solid white",
                    "overflow-y": "auto","width": "auto", "height": "150px"
                }}>
                    <div
                        style={{ "width": "50%", "hight":"auto", "float":"left"}}
                        ref = {(input)=>{this.generator_text=input;}}
                    > Генератор
                    </div>
                    <div
                        style={{ "width": "50%", "hight":"auto", "float":"left"}}
                        ref = {(input)=>{this.original_text=input;}}
                    > Оригинал
                    </div>

                </div>

                <br />

                <textarea
                    ref = {(input)=>{this.user_text=input;}}
                    onKeyDown={(e)=>{if(e.keyCode==13){
                        this.sendUserText();
                    }}}
                >
                    Введи текст
                </textarea>
                <textarea
                    ref = {(input)=>{this.user_tone=input;}}
                >
                    Тон
                </textarea>
                <br />
                <button onClick={this.sendUserText}>Send</button>
                <button>Edit</button>
            </div>
        )
    }
};