import requests
import time
host = "https://isepdcpolicy3.dpsk12.org:8443"

PostHeaders1 = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
    "Accept": "text/html, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding":"gzip, deflate, br",
    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
}

PostHeaders2 = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
    "Accept": "application/json;",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding":"gzip, deflate, br",
    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
}

post1data = {
    "token":"",
    "aupAccepted":"true"
}

post2data = {
    "delayToCoA":"0",
    "coaType":"Reauth",
    "coaSource":"GUEST",
    "coaReason":"Guest+authenticated+for+network+access",
    "waitForCoA":"true",
    #"portalSessionId":"",
    #"token":""
}



#https://isepdcpolicy2.dpsk12.org:8443/portal/gateway?sessionId=34c8a8c0019cf3a8718dff63&portal=babb8002-19ea-11e5-b84d-000c293e8509&action=cwa&type=drw&token=71ee3d0e9d322a71d04a6c2d1a898e98&redirect=1.1.1.1/

def getvalue(string):
    value = ""
    for i in range(0,len(string)):
        char = string[i]
        if(char == "\""):
            break
        else:
            value = value + char
    return value      
        
x = requests.get('http://1.1.1.1')
response = x.text

url = response.find("URL=")

#try:
URLVal = getvalue(response[(url+4):])

request = requests.get(URLVal, headers=PostHeaders1)
print(URLVal)

rescookies = request.cookies

post1data["token"] = rescookies["token"]

#post2data["portalSessionId"] = rescookies["portalSessionId"]
#post2data["token"] = rescookies["token"]


repcook={
    "token":rescookies["token"],
    "portalSessionId":rescookies["portalSessionId"],
    "checkCookiesEnabled":"value",
    "APPSESSIONID":rescookies["APPSESSIONID"]
}

r1 = requests.post(host+"/portal/AupSubmit.action?from=AUP", headers=PostHeaders1, data=post1data, cookies=repcook)
print(r1)
print("Request 1 Sent!: "+ r1.text)
#time.sleep(1)
#
r2 = requests.post("https://isepdcpolicy3.dpsk12.org:8443/portal/DoCoA.action", headers=PostHeaders1, data=post2data ,cookies=repcook )
print(r2)
print("Request 2 Sent!: "+ r2.text)
print(post2data)
print(repcook)
#print(post1data)
#print(post2data)
#print(repcook)
#except:
#    print("error")



###Current Problem is request 2 body feild, providing it causeing an error for some reason
    


