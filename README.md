## This is the instuctions on how to use the code found in this github

#### PiCode
Code that needs to be run on the device that is connected to the sensor board, the **endpoint** and **ser** varibles will need to be modified depending on the system setup. Endpoint var should be set to the public facing ip of the NodeSever. **ser** var should be modifed to be the usb port the board is currently readable from. 

#### NodeServer
Needs to be ran on a system outside of the DPS network, services such as cloudflare tunnels and Ngrok will likely not work due to the current active VPN ban. Portforward port 80 and set the **endpoint** var in the python code to the public IP adress of the NodeServer. This will also be the address to the webpage used to access live data.
