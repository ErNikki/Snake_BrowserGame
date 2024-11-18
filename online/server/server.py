import json
import random
import asyncio
import websockets
from time import sleep

connection=[]
waitForConnection=[]

SERVER='S'
CLIENT='C'
CLIENT_LEFT='L'
YOU_WIN='1'
NEW_CONNECTION='N'
CLOSE_CONNECTION='K'

def client_left(client, server):

    if (client in waitForConnection):
        waitForConnection.remove(client)

    for e in connection:
        if (e[0]==client):
            msg=CLIENT_LEFT
            server.send_message(e[1], msg)
            connection.remove(e)
            #msg = "Client (%s) left" % client['id']
            #print (msg)  
        if (e[1]==client):
            msg=CLIENT_LEFT
            server.send_message(e[0], msg)
            connection.remove(e)
            #msg = "Client (%s) left" % client['id']
            #print (msg)  

def new_client(client, server):
    msg = "New client (%s) connected" % client['id']
    if (len(waitForConnection)>0):
            s=waitForConnection.pop()
            connection.append((s,client))
            server.send_message(s,SERVER)
            server.send_message(client,CLIENT)            
            #msg = "New link with Server: (%s) - Client: (%s) " % s['id'] % client['id']
            #print(msg)
    else:
        waitForConnection.append(client)
        msg = "New added on WaitForConnection (%s) connected" % client['id']
        #print(msg)

def msg_received(client, server, msg):


    for e in connection:
        if e[0]==client:
            server.send_message(e[1],msg)
            msg = "Send (%s) " % e[1]['id']
            print(msg)
            break
        if e[1]==client:
            server.send_message(e[0],msg)
            msg = "Send (%s) " % e[0]['id']
            print(msg)
            break
        print("other")


async def handler(websocket, path):

    while True:
        '''
        try:
            msg = await websocket.recv()
            print(msg)
        except websockets.exceptions.ConnectionClosed:
            for e in connection:
                if (e[0]==websocket or e[1]==websocket):
                    await e[1].send(CLIENT_LEFT)
                    await e[0].send(CLIENT_LEFT)
                    connection.remove(e)
            print ("CLOSE CONNECTION",connection)   
            continue
        '''
        msg = await websocket.recv()
        
        if(msg==NEW_CONNECTION):
            print ("NEW CONNECTION")
            if(len(waitForConnection)>0):
                s=waitForConnection.pop()
                connection.append((s,websocket))
                await s.send(SERVER)
                await websocket.send(CLIENT)
            else:
                waitForConnection.append(websocket)

        elif(msg==CLOSE_CONNECTION):
            print ("CLOSE CONNECTION HERE")
            if (websocket in waitForConnection):
                waitForConnection.remove(websocket)

            for e in connection:
                if (e[0]==websocket):
                    await e[1].send(YOU_WIN)
                    if(e in connection):
                        connection.remove(e)

                if (e[1]==websocket):
                    await e[0].send(YOU_WIN)
                    if(e in connection):
                        connection.remove(e)

            continue
        else:
            for e in connection:
                if(e[0]==websocket):
                    #connessione già registratia
                    await e[1].send(msg)

                if(e[1]==websocket):
                    await e[0].send(msg)
        '''
        except websockets.exceptions.ConnectionClosed:
            print ("EXCEPTION")
            print(connection)
            for e in connection:
                if (e[0]==websocket or e[1]==websocket):
                    connection.remove(e)
                
                if (e[1]==websocket):
                    #await e[0].send(CLIENT_LEFT)
                    connection.remove(e) 
                
        '''
  

    #msg = await websocket.recv()
    
    #| serpente | score | ROLE | foodPosition | needFood |
    #| serpente | score | ROLE | foodPosition | needFood |

    #await websocket.send(msg)
    #send msg
    

start_server = websockets.serve(handler, '0.0.0.0', 9001)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
