const MODE = 'PRODUCT'; //DEV, PRODUCT 
let _URL = '';
let _PORT = '8088';

switch(MODE) {
  case 'DEV':
    _URL = `192.168.0.1:${_PORT}/`;
    break;

  case 'PRODUCT':
    _URL = `ec2-3-34-194-140.ap-northeast-2.compute.amazonaws.com:${_PORT}/`; 
    break;

  default:
    break;
}

export { _URL };