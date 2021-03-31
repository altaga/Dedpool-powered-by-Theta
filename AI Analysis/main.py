
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array,load_img
import numpy as np
import cv2
import requests
import time
from PIL import Image,ImageOps
import pyscreenshot as ImageGrab
import pytesseract
from timeit import default_timer as timer
from threading import Thread
import paho.mqtt.client as mqtt

mqttc = mqtt.Client()

rc = 0

tf.get_logger().setLevel('ERROR')

# Text Detection

layerNames = [
	"feature_fusion/Conv_7/Sigmoid",
	"feature_fusion/concat_3"]

net = cv2.dnn.readNet("frozen_east_text_detection.pb")

# Text recognition

pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

# Number recognition

model = load_model('lolmnist_opt.h5')

# API

nlabels = [0,1,2,3,4,5,6,7,8,9]

left = Image.open('empty.png')

memb=0
memr=0

timeLOL = ""
event = ""

blue_score=0
red_score=0

events=[]
events_array=[]

strings=""

def predict_digit(array_numbers):
    my_list = []
    for x in array_numbers:
        image = load_img(x, color_mode="grayscale",target_size=(28, 28))
        image = img_to_array(image)
        image = preprocess_input(image)
        image = np.array(image, dtype="float32")
        if np.mean(image) >= 0.8:
            continue
        my_list.append(image)
    check_array = np.array(my_list)
    #start = time.time()
    res = model.predict(check_array)
    if(len(check_array)==0):
        #end = time.time()
        #print("Open and Process:" + str(end - start))
        return(-1)
    elif(len(check_array)==1):
        #end = time.time()
        #print("Open and Process:" + str(end - start))
        return(nlabels[np.argmax(res[0])])
    elif(len(check_array)==2):
        #end = time.time()
        #print("Open and Process:" + str(end - start))
        return(nlabels[np.argmax(res[0])]*10+nlabels[np.argmax(res[1])])
    elif(len(check_array)==3):
        #end = time.time()
        #print("Open and Process:" + str(end - start))
        return(nlabels[np.argmax(res[0])]*100+nlabels[np.argmax(res[1])]*10+nlabels[np.argmax(res[2])])

def predict_digit2(array_numbers):
    my_list = []
    for x in array_numbers:
        image = load_img(x, color_mode="grayscale",target_size=(28, 28))
        image = img_to_array(image)
        image = preprocess_input(image)
        image = np.array(image, dtype="float32")
        if np.mean(image) >= 0.8:
            continue
        my_list.append(image)
    check_array = np.array(my_list)
    #start = time.time()
    res = model.predict(check_array)
    if(len(check_array)==0):
        end = time.time()
        #print("Open and Process:" + str(end - start))
        return(-1)
    elif(len(check_array)==1):
        end = time.time()
        #print("Open and Process:" + str(end - start))
        return(nlabels[np.argmax(res[0])])
    elif(len(check_array)==2):
        #end = time.time()
        #print("Open and Process:" + str(end - start))
        return(nlabels[np.argmax(res[1])]*10+nlabels[np.argmax(res[0])])
    elif(len(check_array)==3):
        #end = time.time()
        #print("Open and Process:" + str(end - start))
        return(nlabels[np.argmax(res[2])]*100+nlabels[np.argmax(res[1])]*10+nlabels[np.argmax(res[0])])

def pillow2opencv(pillowImage):
    open_cv_image = np.array(pillowImage) 
    return open_cv_image[:, :, ::-1].copy() 

def eventCheck():
    global strings
    global events
    global events_array
    global rc
    strings = pytesseract.image_to_string(events[0])
    events.pop(0)
    try:
        if (strings.find('PENTAKILL!') != -1): 
            mqttc.publish("/event","PENTAKILL!")
        elif (strings.find('SHUT DOWN!') != -1): 
            mqttc.publish("/event","SHUTDOWN!")
        elif (strings.find('SHUTDOWN!') != -1): 
            mqttc.publish("/event","SHUTDOWN!")
        elif (strings.find('DOUBLEKILL!') != -1): 
            mqttc.publish("/event","DOUBLEKILL!")
        elif (strings.find('DOUBLE KILL!') != -1): 
            mqttc.publish("/event","DOUBLEKILL!")
        elif (strings.find('TRIPLEKILL!') != -1): 
            mqttc.publish("/event","TRIPLEKILL!")
        elif (strings.find('TRIPLE KILL!') != -1): 
            mqttc.publish("/event","TRIPLEKILL!")
        elif (strings.find('QUADRAKILL!') != -1): 
            mqttc.publish("/event","QUADRAKILL!")
        elif (strings.find('QUADRA KILL!') != -1): 
            mqttc.publish("/event","QUADRAKILL!")
        rc = mqttc.loop()
    except:
        ...


t4 = Thread(target=eventCheck)

def eventQuery(img):
    global events
    if(textCheck(pillow2opencv(img))):
        events.append(img)
        return("Event In Process")
    else:
        return("No Event")

def textCheck(imag):
	#start = time.time()
	orig = imag.copy()
	(H, W) =imag.shape[:2]

	(newW, newH) = (32*2, 32*2)
	rW = W / float(newW)
	rH = H / float(newH)

	# resize the image and grab the new image dimensions
	imag = cv2.resize(imag, (newW, newH))

	(H, W) = imag.shape[:2]

	blob = cv2.dnn.blobFromImage(imag, 1.0, (W, H),
		(123.68, 116.78, 103.94), swapRB=True, crop=False)
	net.setInput(blob)
	(scores, geometry) = net.forward(layerNames)
	

	(numRows, numCols) = scores.shape[2:4]
	rects = []
	confidences = []
	flag = 0

	for y in range(0, numRows):
		scoresData = scores[0, 0, y]
		for x in range(0, numCols):
			if(scoresData[x] > .9):
				flag = 1
	#end = time.time()
	#print("Check Text:" + str(end - start))
	return(flag)

def eventTime(img):
    string = pytesseract.image_to_string(img)[0:5]
    return(string)

def scoreThread():
    
    global blue_score
    global red_score
    global memb
    global memr
    global im
    global rc
    bthree = im.crop((1565, 7, 1575, 22))
    btwo = im.crop((1555, 7, 1565, 22))
    bone = im.crop((1545, 7, 1555, 22))
    rone = im.crop((1597, 7, 1607, 22))
    rtwo = im.crop((1607, 7, 1617, 22))
    rthree = im.crop((1617, 7, 1627, 22))

    new_image = Image.new('RGB',(16, 15), (250,250,250))
    new_image.paste(left,(0,0))
    new_image.paste(bthree,(3,0))
    new_image.paste(left,(13,0))
    bthree = new_image
    new_image = Image.new('RGB',(16, 15), (250,250,250))
    new_image.paste(left,(0,0))
    new_image.paste(btwo,(3,0))
    new_image.paste(left,(13,0))
    btwo = new_image
    new_image = Image.new('RGB',(16, 15), (250,250,250))
    new_image.paste(left,(0,0))
    new_image.paste(bone,(3,0))
    new_image.paste(left,(13,0))
    bone = new_image
    new_image = Image.new('RGB',(16, 15), (250,250,250))
    new_image.paste(left,(0,0))
    new_image.paste(rone,(3,0))
    new_image.paste(left,(13,0))
    rone = new_image
    new_image = Image.new('RGB',(16, 15), (250,250,250))
    new_image.paste(left,(0,0))
    new_image.paste(rtwo,(3,0))
    new_image.paste(left,(13,0))
    rtwo = new_image
    new_image = Image.new('RGB',(16, 15), (250,250,250))
    new_image.paste(left,(0,0))
    new_image.paste(rthree,(3,0))
    new_image.paste(left,(13,0))
    rthree = new_image

    newsize = (28, 28) 

    bone = bone.resize(newsize)
    btwo = btwo.resize(newsize)
    bthree = bthree.resize(newsize)
    rone = rone.resize(newsize)
    rtwo = rtwo.resize(newsize)
    rthree = rthree.resize(newsize)

    bone = cv2.cvtColor(pillow2opencv(bone), cv2.COLOR_BGR2GRAY)
    btwo = cv2.cvtColor(pillow2opencv(btwo), cv2.COLOR_BGR2GRAY)
    bthree = cv2.cvtColor(pillow2opencv(bthree), cv2.COLOR_BGR2GRAY)
    rone = cv2.cvtColor(pillow2opencv(rone), cv2.COLOR_BGR2GRAY)
    rtwo = cv2.cvtColor(pillow2opencv(rtwo), cv2.COLOR_BGR2GRAY)
    rthree = cv2.cvtColor(pillow2opencv(rthree), cv2.COLOR_BGR2GRAY)

    thres_value = 70

    ret1,thresh1 = cv2.threshold(bone,thres_value,255,cv2.THRESH_BINARY_INV)
    ret2,thresh2 = cv2.threshold(btwo,thres_value,255,cv2.THRESH_BINARY_INV)
    ret3,thresh3 = cv2.threshold(bthree,thres_value,255,cv2.THRESH_BINARY_INV)
    ret4,thresh4 = cv2.threshold(rone,thres_value,255,cv2.THRESH_BINARY_INV)
    ret5,thresh5 = cv2.threshold(rtwo,thres_value,255,cv2.THRESH_BINARY_INV)
    ret6,thresh6 = cv2.threshold(rthree,thres_value,255,cv2.THRESH_BINARY_INV)

    cv2.imwrite("bonepost.png", thresh1)
    cv2.imwrite("btwopost.png", thresh2)  
    cv2.imwrite("bthreepost.png", thresh3) 
    cv2.imwrite("ronepost.png", thresh4) 
    cv2.imwrite("rtwopost.png", thresh5) 
    cv2.imwrite("rthreepost.png", thresh6)
    
    blue_score = predict_digit(['bonepost.png','btwopost.png','bthreepost.png'])
    red_score = predict_digit2(['rthreepost.png','rtwopost.png','ronepost.png'])   

    if(abs(memb-blue_score)>50):
        blue_score=memb
    else:
        memb=blue_score
    if(abs(memr-red_score)>50):
        red_score=memr
    else:
        memr=red_score
    mqttc.publish("/score",str(red_score)+","+str(blue_score))
    rc = mqttc.loop()

def timeThread():
    #start = timer()
    global timeLOL
    global im
    global rc
    imageT = im.convert('L')
    imageT = ImageOps.invert(imageT)
    imageT = imageT.crop((1854, 0, 1916, 30))
    threshold = 130
    imageT = imageT.point(lambda p: p > threshold and 255)
    timeLOL = eventTime(imageT)
    mqttc.publish("/time",str(timeLOL))
    rc = mqttc.loop()
    #print("Time:" + str(timer() - start))

def eventThread():
    #start = timer()  
    global event
    global im
    global events_array
    imageE = im.crop((700, 100, 1220, 500))
    eventQuery(imageE)
    #print("Event:" + str(timer() - start))
    # Score 

# Define event callbacks
def on_connect(client, userdata, flags, rc):
    print("rc: " + str(rc))

mqttc.on_connect = on_connect
mqttc.username_pw_set("AzsqQzsYDNEZE9EblASbKZ3oy14kGCz61RlGeBuHeWuHVYG5oo6WcYaAN3Ikv7el", "")
mqttc.connect("mqtt.flespi.io", 1883, keepalive=60)
rc = 0

while rc == 0:
    rc = mqttc.loop()
    im = ImageGrab.grab(bbox=(0, 0,1920 , 1080))
    eventThread()

    if(len(events)==0):
        t1 = Thread(target=scoreThread)
        t2 = Thread(target=timeThread)
        t1.start()
        t2.start()
        t1.join()
        t2.join()

    if not(t4.is_alive()):
        if(len(events)>0):
            t4 = Thread(target=eventCheck)
            t4.start()
