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


function TransmissionController(torrentUrl) {

    this._settings = new Settings();

    this._transmission = new Transmission(this._settings.server, this._settings.username, this._settings.password);

    var controller = this;

    // Get the location of where to download the torrent from the Transmission
    // server.
    this._location = '';
    this._transmission.getSession(function(result) {
        if (result instanceof Transmission.Success) {
           this._location = result['download-dir'];
        }
    });

    Torrent.loadFromUrl(torrentUrl, function(torrent) {
        if (!torrent.isValid()) {
            controller.showModalMessage('Invalid torrent', 'Not a valid torrent', 'error', ['close']);
        }
        else {
            controller.addTorrent(torrent, false);
        }
    });
}

TransmissionController.prototype.showModalMessage = function(header, message, style, buttons, actions) {
    alert(header + ': ' + message);
};

TransmissionController.prototype.showTrackers = function(trackers) {
    for ( var i = 0, length = trackers.length; i < length; ++i) {
        var li = $('<li></li>').appendTo('#attr-announce');
        li.attr('title', trackers[i]);
        li.text(trackers[i]);
    }
    $('#attr-announce').parent('dd').removeClass('hidden').prev('dt').removeClass('hidden');
};

TransmissionController.prototype.resizeHeader = function() {
    if ($('#filelist-header').is(':visible')) {
        $('#filelist-header').width(document.getElementById('filelist-container').clientWidth);
        $('#filelist-footer').width(document.getElementById('filelist-container').clientWidth);
    }
};

TransmissionController.prototype.addTorrent = function(torrent, paused) {
    var args = Transmission.customizeAddTorrent(this._location, paused);
    var controller = this;

    this._transmission.addTorrent(torrent, args, function(result) {
        if (result instanceof Transmission.Failure && result.toString() === 'duplicate torrent') {
            controller.showModalMessage(
                'Duplicate torrent', 'This torrent has been already added to Transmission.', 'error', ['close']);
        }
        else if (!(result instanceof Transmission.Success)){
            controller.showModalMessage(
                'Error', 'Torrent addition failed', 'error', ['close']);
        }
    });
};

