import paho.mqtt.client as mqtt
import json
import subprocess
import os

mqttc = mqtt.Client()
print("Start Mqtt Setup")

# Define event callbacks
def on_connect(client, userdata, flags, rc):
    print("rc: " + str(rc))

def on_message(client, obj, msg):
    global mqttc
    temp = json.loads(str(msg.payload.decode()))
    if(msg.topic == "/TF"):
        command = ['bash','theta.sh', temp["Accountin"],temp["Accountout"], temp["T"], temp["TF"], '0']
        response = subprocess.run(command,stdout=subprocess.PIPE, text=True, input="qwertyuiop\n")
        response = response.stdout
        where = response.find("expected")
        number = response[70:73].replace('.', '').replace(' ', '')
        command = ['bash','theta.sh', temp["Accountin"],temp["Accountout"], temp["T"], temp["TF"], number]
        response = subprocess.run(command,stdout=subprocess.PIPE, text=True, input="qwertyuiop\n")
        response = response.stdout
        print(response)
        
    elif(msg.topic == "/TQ"):
        command = ['bash','thetaq.sh', temp["Accountin"]]
        response = subprocess.run(command,stdout=subprocess.PIPE, text=True)
        response = response.stdout
        temp = json.loads(response)
        temp = (int(temp["coins"]["tfuelwei"])/1000000000000000000)-312500000
        mqttc.publish("/TQR", temp)
    
    elif(msg.topic == "/reflow"):
        temp = int(temp["balance"])
        mqttc.publish("/reflowA", temp)

mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.username_pw_set("<FLESPI TOKEN>", "")
mqttc.connect("mqtt.flespi.io", 1883, keepalive=60)
mqttc.subscribe("/TF", 0)
mqttc.subscribe("/TQ", 0)
mqttc.subscribe("/reflow", 0)
print("Link Start!")
mqttc.loop_forever()

