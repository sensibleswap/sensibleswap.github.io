import VoltClient from 'voltsdk';

const appId = "8bae44b15817711c";

const Volt = new VoltClient({appId, loginType: 'normal'});
export default Volt;