export class PostConstruct {
  defaultFilespec:any;
  defaultFilesize:string;
  interval:any[];
  defaultTags:string[];
  defaultChange:string;
  defaultTag:string;
  defaultFileStatus:any;
  

  constructor(){
    this.defaultTag='Public';
    this.defaultTags=[];
    this.defaultFilespec={acceptExtensions:['jpg','png','pdf','ppt','mp3','doc','docx','mp4'],maxFilesCount: 1, maxFileSize: 512000000};
    this.defaultFileStatus = {status: undefined, value: undefined, file: undefined};
    this.interval = [
      { min: 1 , singular: 'just now'},
      { min: 1000 , singular: 'a sec ago', plural : ' secs ago'},
      { min: 60000 , singular: 'a min ago', plural : ' mins ago'}];
    this.defaultChange = this.color(6);
  }
  
  timeToword(time){
    let then = new Date(time['date_created']).getTime(), now =  Date.now(), ago = now - then, result;
    if(this.interval[0].min<ago && this.interval[1].min>ago){ time['short_date_created']=this.wordCal(0, 1);
    }else if(this.interval[1].min<=ago && this.interval[2].min>ago){ time['short_date_created']=this.wordCal(1, ago);
    }else{ time['short_date_created'] = this.normalCal(time);};
    return time;
  }
  
  wordCal(num, ago){
    let subCal, valCal;
    subCal = Math.round(ago/this.interval[num].min);
    if(subCal == 1){ valCal = this.interval[num].singular;}
    else{valCal = subCal + this.interval[num].plural;}
    return valCal;
  }
  
  normalCal(data){
    let date = new Date(data['date_created']).toJSON().slice(0, 16).replace(/T/g, ' ');
    return date;
  }
  
  color(data){
    let result;
    if(data == "1"){ result = "bg-success"; }
    else if(data == "2"){ result = "bg-primary"; }
    else if(data == "3"){ result = "bg-warning"; }
    else if(data == "4"){ result = "bg-danger"; }
    else if(data == "5"){ result = "bg-light"; }
    else if(data == "6"){ result = "bg-white"; }
    return result
  }
}

export class Post{
  category:string;
  content:string;
  tag:string;
  color:string;
  owner:string;
  department:string;
  ownerPic:string;
  constructor(){};
}

export class Response{
  errors:any[];
  constructor(){};
}

