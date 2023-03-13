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
    "waitForCoA":"true"
}

def getvalue(string):
    value = ""
    for i in range(0,len(string)):
        char = string[i]
        if(char == "\""):
            break
        else:
            value = value + char
    return value      

try:
    print("Testing internet connection...")
    google = requests.get("https://www.google.com")
    print("Internet already works, aborting proccess")
except:
    print("Connection Failed, attemting reauth...")
    try:
        x = requests.get('http://1.1.1.1')
        response = x.text

        url = response.find("URL=")

        URLVal = getvalue(response[(url+4):])

        request = requests.get(URLVal, headers=PostHeaders1)

        rescookies = request.cookies

        post1data["token"] = rescookies["token"]

        repcook={
            "token":rescookies["token"],
            "portalSessionId":rescookies["portalSessionId"],
            "checkCookiesEnabled":"value",
            "APPSESSIONID":rescookies["APPSESSIONID"]
        }

        r1 = requests.post(host+"/portal/AupSubmit.action?from=AUP", headers=PostHeaders1, data=post1data, cookies=repcook)
        print(r1)
        if(r1.status_code != 200):
            print("Error, request 1 failure. Did request format change?")
        else:
            r2 = requests.post("https://isepdcpolicy3.dpsk12.org:8443/portal/DoCoA.action", headers=PostHeaders1, data="delayToCoA=0&coaType=Reauth&coaSource=GUEST&coaReason=Guest+authenticated+for+network+access&waitForCoA=true" ,cookies=repcook )
            print(r2)
            if(r2.status_code != 200):
                print("Error, request 2 failure. Did request format change?")     
            else:
                try:
                    google = requests.get("https://www.google.com")
                    print("Internet is now in working condition! ^-^")
                except:
                    print("Wow, somthing went very wrong. No clue how this happend. Try again mabye?")
    except:
        print("Connection failure, script may be outdated")