import VoltClient from 'voltsdk';

const appId = "8bae44b15817711c";
const  wsess = "xprv9s21ZrQH143K2DhtgULVvGu32FPvUJ9eyuPa8ALNwbykpJMZ4zvBehiC12tT9KCx3KFuFBkdLH4RfGPp7NdMaEpUid2UDHoUCQxu8yXrmfo";

const Volt = new VoltClient(appId, wsess);
export default Volt;