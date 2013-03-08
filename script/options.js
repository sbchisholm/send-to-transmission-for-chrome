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

/*global Settings:false, Transmission:false*/

var TXT_SETTINGS_SAVED = 'Settings saved';
var TXT_SERVER_OK = 'Server settings are OK';
var TXT_SERVER_FAILURE = 'Server is not responding';
var TXT_BTN_TEST = 'Test';
var TXT_BTN_CONNECTING = 'Connecting...';
var TXT_LABEL_UNAVAILABLE = 'Unavailable';

var ElementProxy = (function() {

    var template = (function() {
        function generateTemplate(custom) {
            var row = document.createElement('tr');

            var label = document.createElement('input');
            label.type = 'text';
            row.insertCell(-1).appendChild(label);

            var path = document.createElement('input');
            path.type = 'text';
            if (!custom) {
                path.disabled = true;
                path.placeholder = TXT_LABEL_UNAVAILABLE;
            }
            row.insertCell(-1).appendChild(path);

            var controls = row.insertCell(-1);

            var up = document.createElement('div');
            up.classList.add('button');
            up.classList.add('up');
            controls.appendChild(up);

            var down = document.createElement('div');
            down.classList.add('button');
            down.classList.add('down');
            controls.appendChild(down);

            if (custom) {
                var remove = document.createElement('div');
                remove.classList.add('button');
                remove.classList.add('remove');
                controls.appendChild(remove);
            }

            return row;
        }

        return {
            'default': generateTemplate(false),
            'custom': generateTemplate(true)
        };
    }());

}());




function PageController() {
    this._settings = new Settings();
    $('#server').val(this._settings.server);
    $('#username').val(this._settings.username);
    $('#password').val(this._settings.password);

    this.testServer(this._settings.server, this._settings.username, this._settings.password);

    var controller = this;

    $('#save').click(function(event) {
        controller.saveSettings();
    });

    $('#test').click(function(event) {
        controller.testServer($('#server').val(), $('#username').val(), $('#password').val());
    });

    $('#close').click(function(event) {
        window.close();
    });
}

PageController.prototype.showMessage = function(text, style) {
    var message = $('#message');

    if (message.hasClass('show')) {
        message.removeClass().addClass('hide');
    }
    else {
        message.removeClass().addClass('show');
    }
    message.addClass(style).text(text);

    $('#message-container').toggleClass('show').toggleClass('hide');
};

PageController.prototype.testServer = function(server, username, password) {
    $('#test').text(TXT_BTN_CONNECTING).prop('disabled', true);

    var transmission = new Transmission(server, username, password);
    var controller = this;

    transmission.getSession(function(result) {
        $('#test').text(TXT_BTN_TEST).prop('disabled', false);
        if (result instanceof Transmission.Success) {
            $('#version').removeClass('unavailable').text(result['version']);
            controller.showMessage(TXT_SERVER_OK, 'success');
        } else {
            $('#version').addClass('unavailable').text(TXT_LABEL_UNAVAILABLE);
            controller.showMessage(TXT_SERVER_FAILURE, 'failure');
        }
    });
};

PageController.prototype.saveSettings = function() {
    this._settings.server = $('#server').val();
    this._settings.username = $('#username').val();
    this._settings.password = $('#password').val();
    this._settings.save();

    this.showMessage(TXT_SETTINGS_SAVED, 'success');
};

(function() {
    var controller = null;

    $(document).ready(function() {
        controller = new PageController();
    });
}());
