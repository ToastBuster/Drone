import serial
import time
import requests
import json
import random
import os
from datetime import datetime

failedReads = 0

ser = serial.Serial('/dev/ttyUSB0')
ser.flushInput()

endpoint = "35.92.107.138"

currentdir = os.getcwd()
logDir = os.path.join(currentdir, "DataLogs")

try:
    os.mkdir(logDir)
except OSError as error:
    print(error)

logfile = logDir+"/"+datetime.now().strftime("%H:%M:%S")+".txt"

#{"BombGas":61, "Smoke":36, "CO":102, "Tempature":75.02, "Humidity":13.00, "Pressure":83666, "Altitude":1586.61}
# random.randint(3, 9)

while True:
    try:

        data = str(ser.readline())[2:-5]
        jsondata = json.loads(data)
        failedReads = 0

        log = open(logfile, "a")
        log.write(data+"\n")
        log.close()

        current_time = datetime.now().strftime("%H:%M:%S")
        jsondata["timestamp"] = round(time.time() * 1000)
        jsondata["timestamp-pretty"] = current_time
        print(jsondata)
        x = requests.post(url = 'http://'+endpoint+'/inputdata/', data = jsondata)
        time.sleep(1)
    except KeyboardInterrupt:
        print("Keyboard Interrupt")
        break
    except:
        print("Invalid Json")
        failedReads+=1
        if(failedReads > 20):
            print("Sensor Error: Invalid Data Output")
            break
