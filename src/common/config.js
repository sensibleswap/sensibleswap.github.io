'use strict';
import qs from 'querystringify';
import _ from 'i18n';

const location = window.location;
const { search } = location;

export const query = qs.parse(search);


export function agentVersion() {
    var userAgentInfo = window.navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            return Agents[v];
            // break;
        }
        
    }
    return 'PC';
}
