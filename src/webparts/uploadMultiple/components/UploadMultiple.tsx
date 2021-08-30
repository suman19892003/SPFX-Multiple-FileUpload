import * as React from 'react';
import styles from './UploadMultiple.module.scss';
import { IUploadMultipleProps } from './IUploadMultipleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web, IWeb, sp } from "@pnp/sp/presets/all";

export default class UploadMultiple extends React.Component<IUploadMultipleProps, any> {
  
  
  constructor(props){
    super(props)
    this.state = {
      open: false,
      fileShare:false,
      itemID:0,
      itemColl:[],
      EnclouserUploadedFiles:[]
    };
    this.getFileItems=this.getFileItems.bind(this)
  }

  componentDidMount(){
    this.getFileItems();
    
  }
  onOpenModal = (itemID) => {
    //alert('Opened')
    this.setState({ open: true });
    this.setState({ itemID: itemID });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  getFileItems(){
    let { itemColl } = this.state;
    sp.web.lists.getByTitle('MyDoc').items.select('Id,FileRef,File,Title').expand('File').get().then(file=>{
      debugger;
      console.log(file);
      file.map((item)=>{       
        console.log(item.FileRef);
        itemColl.push({FileName:item.File.Name,FileURL:item.FileRef,ItemID:item.ID});       
      }) 
      //file[0].File.Name
      //file[0].FileRef
      this.setState({ open: false });
    })
  }

  public onFileUpload (file) {
    debugger;
    let File = file;
    let isValid = true;
    let fileArray = [];
    let fileNames = [];
    let files = [];
    files = this.state.EnclouserUploadedFiles;
    
    for (let i=0;i<File.length;i++)
    {
      let currentFile = File[i];
      var isFiileExists = false;
      
      for (let index = 0; index< files.length;index++)
      {
        const element = files[index];
        if(element.File.name && element.File.name == currentFile.name)
        {
          isFiileExists =  true;
        }
        else if (element.File.FileLeafRef && element.File.FileLeafRef == currentFile.name)
        {
          isFiileExists =  true;
        }
      }
      if (isFiileExists == false)
      {
        fileNames.push(currentFile.name);
        files.push({
          File:currentFile
        })
      }
       
    }
    this.setState({
      EnclouserUploadedFiles:files
    })
  }

  public bindSavedEnclouserUploadedFiles () {
    debugger;
    let uploadedFiles = this.state.EnclouserUploadedFiles;
    let Data = uploadedFiles,
    MakeItem = (y,i)=>{
      let fileName = y.File;
      if( fileName && fileName.name){
        let files = [];
        files = fileName.name;
         return (
          <li>     
            <span>
             <a href="javascript:{}">{files}
           </a>
           </span>
           {<a title={'Deselect'} onClick={(e)=>this.removeSelectedFile(fileName)}><i
           className="fa fa-times-circle" arua-aria-hidden="true"
         ></i></a>}
        </li>
         )       
      }
      else if (fileName && fileName.FileLeafRef){
        let files = fileName.FileLeafRef;
        if(files.indexOf('~') != -1){
          let data = files.split('~');
          files = data[1];
        }
        return(
          <li>
            <span>
               {/* <a href="javascript:{}" onClick={() => {this.downloadFile(fileName.FileRef)}}> */}
               <a href="javascript:{}">
                 {files}
                </a>
               </span>
              {/* <a title={"Delete"} onClick={(e)=>this.deleteUploadedFile(fileName.FileLeafRef)}> */}
              <a title={"Delete"}>
               <i className="fa fa-times-circle" aria-hidden="true"></i>
              </a>
          </li>
        )
      }
    }
     uploadedFiles.map((y,i)=>{
      let fileName = y.File;
      if( fileName && fileName.name){
        let files = [];
        files = fileName.name;
        return (
          <li>
            <span>
          <a href="javascript:{}">{files}
          </a>
          </span>
          {<a title={'Deselect'} onClick={(e)=>this.removeSelectedFile(fileName)}><i
          className="fa fa-times-circle-o" arua-aria-hidden="true"
        ></i></a>}
        </li>     
        )
      }
      else if (fileName && fileName.FileLeafRef){
        let files = fileName.FileLeafRef;
        if(files.indexOf('~') != -1){
          let data = files.split('~');
          files = data[1];
        }
        return(
          <li>
            <span>
              {/* <a href="javascript:{}" onClick={() => {this.downloadFile(fileName.FileRef)}}> */}
              <a href="javascript:{}">
                {files}
                </a>
              </span>
              {/* <a title={"Delete"} onClick={(e)=>this.deleteUploadedFile(fileName.FileLeafRef)}> */}
              <a title="Delete">
                <i className="fa fa-times-circle-o" aria-hidden="true"></i>
              </a>
          </li>
          )
         }
        }) 
        if( Data && Data.length){
          return(
            <div>
              <label>Attached Files</label>
              <ul>
                {Data.map(MakeItem)}
              </ul>
            </div>
          )
        }
    }

    public removeSelectedFile (row) {
      debugger;
      let rowData =row;
      if(this.state.EnclouserUploadedFiles && this.state.EnclouserUploadedFiles.length>0){
        let newArray = [];
        for(let index = 0; index<this.state.EnclouserUploadedFiles.length;index++){
          const element = this.state.EnclouserUploadedFiles[index];
          if(element && element.File.name){
            if(row.name != element.File.name){
              newArray.push(element);
            }
          }
          else{
            newArray.push(element);
          }
        }
        this.setState({
          EnclouserUploadedFiles:newArray
        })
      }
    }

    public onSubmit () {
      debugger;
      var uploadedFileName = '';
      //var Folderpath = [sp.web.lists.getByTitle('MyDoc')].join("/");
      var Folderpath = this.props.siteUrl+'/MyDoc'; //[sp.web.lists.getByTitle('MyDoc')].join("/");
      for(let index = 0;index<this.state.EnclouserUploadedFiles.length;index++){
        const element = this.state.EnclouserUploadedFiles[index];
        var fileName = element.File.name;
        var fileExist:string = fileName.substring(fileName.lastIndexOf('.'),fileName.length);
        uploadedFileName = fileName;
        fileName = fileName.replace(/[\)!@#$%^&*_+;<(){}>?/|\,:-]+/g,"-");
        //sp.web.getFolderByServerRelativeUrl(Folderpath).files.add(fileName,element.File,true).then((
          const file = sp.web.getFolderByServerRelativeUrl('MyDoc').files.add(fileName,element.File,true).then((
        result:any
      )=>{
        debugger
        result.file.getItem().then((file)=>{
          debugger;
          console.log(file)
        }).then((e) => {})
      });
     }
    }

    
  
  public render(): React.ReactElement<IUploadMultipleProps> {
    const { open, itemColl,fileShare } = this.state;

      return (<>
      
      <div className="row form-group" >
        <div className="col col-md-3">
          
          <label className="form-control-label" >Enclosure:</label>
          </div>
          <div className="col-8 col-md-6">
          <input type="file" multiple={true} id='uploadFile' onChange={(e)=>this.onFileUpload(e.target.files)}></input>
          </div>
          </div>
          {this.state.EnclouserUploadedFiles && this.state.EnclouserUploadedFiles.length>0?
          
          this.bindSavedEnclouserUploadedFiles():""
          
        }

        <div className="row"> 
          <div className='col-sm-12'>
          <div className="col-sm-2"> 
              <button className="btn btn-primary"  onClick={(e)=>this.onSubmit()} style={{color:'white',padding:'5px',backgroundColor:'orange',display:'inline-block',borderRadius:'20px',border:'1px solid orange',width:'150px',marginLeft:'20px'}} >Save</button>            
          </div>
          </div>
          </div>
    </>
    );
  }
}