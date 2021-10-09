import socket
import random
import time

# local port
UDP_IP = "127.0.0.1" 
UDP_PORT = 3000 

def local(MESSAGE):
    print("UDP target IP: %s" % UDP_IP)
    print("UDP target port: %s" % UDP_PORT)
    print("message: %s" % MESSAGE)

    sock = socket.socket(socket.AF_INET, # Internet
                        socket.SOCK_DGRAM) # UDP
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

    data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
    print("received message: %s" % data)
    print(addr)

for i in range(3):
    lvl = random.randint(0,7)
    iden = 7
    MESSAGELIST = [lvl,iden]
    MESSAGE = bytes(MESSAGELIST)
    local(MESSAGE)
    time.sleep(0.3)

while True:
    lvl = random.randint(0,7)
    iden = random.randint(0,2)
    MESSAGELIST = [lvl,iden]
    MESSAGE = bytes(MESSAGELIST)
    local(MESSAGE)
    time.sleep(0.3)
    