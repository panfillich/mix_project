# http://python-socketio.readthedocs.io/en/latest/

import sys
print('--Python version is %s.%s.%s' % (sys.version_info.major, sys.version_info.minor, sys.version_info.micro))
# print('!Heldfdlo!')
from aiohttp import web
import socketio
import config
import logic
import gener

def handle(request):
    name = request.match_info.get('name', "Anonymous")
    print('Hello')
    text = "Hello, " + name
    return web.Response(text=text)

sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

@sio.on('connect', namespace='/')
def connect(sid, environ):
    print("connect ", sid)

@sio.on('message', namespace='/')
async def message(sid, data):
    print("message ", data)
    await sio.emit('message', logic.find_ansver(data), room=sid)
    # await sio.emit('message', 'bot_ansver', room = sid)

@sio.on('generator', namespace='/')
async def generator(sid, data):
    print(data)
    # await sio.emit('message', logic.find_ansver(data), room=sid)
    await sio.emit('generator', gener.getText(data['text'], data['ton']), room = sid)

@sio.on('disconnect', namespace='/')
def disconnect(sid):
    print('disconnect ', sid)

# app.add_routes([web.get('/', handle), №
#                 web.get('/{name}', handle)])

# async def handle(request):
# 	name = request.match_info.get('name', "Anonymous")
# 	print('Hello')
# 	text = "Hello, " + name
# 	return web.Response(text=text)
#
# app = web.Application()
# app.add_routes([web.get('/', handle),
#                 web.get('/{name}', handle)])

web.run_app(app, host=config.HOST, port=config.PORT) #


