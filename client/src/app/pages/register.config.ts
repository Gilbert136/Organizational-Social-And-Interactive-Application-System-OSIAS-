export class RegisterConstruct {
  departments:string[];
  defaultDepartment:string;
  defaultFilespec:any;
  defaultFilesize:string;

  constructor(){
    this.departments = ["Computer Science & Information Technology","Statistics","Arts","Psychology","Commmunication Studies" ];
    this.defaultDepartment = this.departments[0];
    this.defaultFilespec = {acceptExtensions: ['jpg', 'png'], maxFilesCount: 1, maxFileSize: 1024000};
    this.defaultFilesize = this.defaultFilespec.maxFileSize;
  };
}

export class PrintErrors{
  errors:any[];
  created:string;
  exist:string;
  
  constructor(){};
}

export interface NewUser{
  email:string;
	firstname: string;
	lastname: string;
	contact: string;
	department: string;
	username: string;
	password?: string;
	password2?: string;
}