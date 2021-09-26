export class Configuration{
  serverProtocol:string;
  serverIp:string;
  serverPort:string;
  server:string;

  constructor(){
    // sudo iptables -A INPUT -p tcp -m tcp --dport 3000 -j ACCEPT
    // sudo iptables -A INPUT -p tcp -m tcp --dport 4200 -j ACCEPT

    // this.serverIp = "192.168.43.70";
    //this.serverIp = "192.168.43.194";
    // this.serverIp = "10.90.2.65";
    
    
    this.serverProtocol = 'http';
    this.serverIp = 'localhost';
    this.serverPort = '3000';
    this.server = this.serverProtocol+'://'+this.serverIp+':'+this.serverPort+'/';
  }
}

export class defaultUser{
  user = {category:"default", contact:"default", courses:[], date_created:"default", department:"default", email:"default",
          firstname:"default", image:"default", lastname:"default", picture:"default", profileinfo:[], socialaccounts:[], titles:[],
          token:"default", username:"default", userstatus:"default", __v:0, _id:"default"}
}

 