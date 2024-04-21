export class Image {
    name!: string;
    date!: string;
    absolutePath!: string;
  
    constructor(
        name: string,
        date: string,
        absolutePath: string,

    ) {
        this.name = name;
        this.date = date;
        this.absolutePath = absolutePath;
    }

  
  }
  