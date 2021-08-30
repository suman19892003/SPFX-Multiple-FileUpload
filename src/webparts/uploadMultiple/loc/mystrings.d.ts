declare interface IUploadMultipleWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'UploadMultipleWebPartStrings' {
  const strings: IUploadMultipleWebPartStrings;
  export = strings;
}
