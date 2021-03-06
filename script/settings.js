/*
 * Copyright 2012, Ilya Tsvetkov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the Software), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * The software is provided as is, without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising from,
 * out of or in connection with the software or the use or other dealings in
 * the software.
 */

function Settings() {
    if (localStorage.configVersion == null || localStorage.configVersion < 1) {
        if (localStorage.server == null) {
            localStorage.server = 'http://localhost:9091/transmission/rpc';
        }
        if (localStorage.username == null) {
            localStorage.username = '';
        }
        if (localStorage.password == null) {
            localStorage.password = '';
        }
        
        localStorage.configVersion = 1;
    }
    
    this.server = localStorage.server;
    this.username = localStorage.username;
    this.password = localStorage.password;
    
}

Settings.prototype.save = function() {
    localStorage.server = this.server;
    localStorage.username = this.username;
    localStorage.password = this.password;
};
