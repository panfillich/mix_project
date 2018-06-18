class ServerError extends Error{
    constructor(){
        super(...arguments);
        this.name = 'ServerError';


        this.status = 500;

        this.client_message = '';
        this.client_data = {};

        this.dev_data =  {};
        // dev_message = this.message
    }

    setClientData(data){
        this.client_data = client_data;
        return this;
    }

    setDevMessage(message){
        this.message = message;
        return this;
    }

    setClientMessage(client_message){
        this.client_message = client_message;
        return this;
    }

    setName(name){
        this.name = name;
        return this;
    }

    setStatus(status){
        this.status = status;
        return this;
    }
}

module.exports.ServerError = ServerError;
