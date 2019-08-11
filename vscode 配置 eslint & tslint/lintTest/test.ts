function xx (params: any): void {
  interface Iperson {
    name: string
    age: number
  }
  
  let tom: Iperson = {
    age: 25,
    name: 'Tom',
  };
  
  if(tom.age == 25) {
    console.log(tom.name + '');
  }
  
  let notSure: any = 4;
  notSure = 'ssss';
  notSure = false; // okay, definitely a boolean
}
