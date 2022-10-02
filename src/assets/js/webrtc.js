"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*****************************webrtcstream**************************/
function WebRtcStreamer(videoElement, server, localName, remoteName) {
    this.videoElement = videoElement;
    this.server = server;
    this.myId = -1;
    this.otherId = -1;
    this.localName = localName;
    this.remoteName = remoteName;
    this.request = null;
    this.hangingGet = null;
    this.pc = null;
    this.pcConfig = {
        "rtcpMuxPolicy": "require",
        "iceServers": [{
            urls: "turn:101.132.194.44:3478?transport=tcp",
            username: "neucore",
            credential: "neucore"
        }]
    };
    this.pcOptions = {
        "optional": [{
            "DtlsSrtpKeyAgreement": true
        }]
    };
    this.mediaConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    };
    this.browserinfo = {
        browser: null,
        version: null
    };
    this.event_stream_wait = null;
    this.event_stream_good = null;
    this.event_stream_close = null;
    this.event_device_find_failure = null;
    this.event_connect_server_failure = null;
}
/***************************Browser Detect***************************************/


WebRtcStreamer.prototype.extractVersion = function (uastring, expr, pos) {
    "use strict";

    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
};

WebRtcStreamer.prototype.detectBrowser = function (window) {
    "use strict";

    var navigator = window.navigator; // Fail early if it's not a browser

    if (typeof window === 'undefined' || !window.navigator) {
        this.browserinfo.browser = 'no_browser';
        this.browserinfo.version = -1;
        return;
    }

    if (navigator.mozGetUserMedia) {
        // Firefox.
        this.browserinfo.browser = 'firefox';
        this.browserinfo.version = this.extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        this.browserinfo.browser = 'chrome';
        this.browserinfo.version = this.extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
        // Edge.
        this.browserinfo.browser = 'edge';
        this.browserinfo.version = this.extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
    } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari.
        this.browserinfo.browser = 'safari';
        this.browserinfo.version = this.extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
    } else {
        // Default fallthrough: not supported.
        this.browserinfo.browser = 'no_browser';
        this.browserinfo.version = -1;
    } //  alert(this.browserinfo.browser);
    //  alert(this.browserinfo.version);

};
/***************************singin***************************************/


WebRtcStreamer.prototype.ConnectToServer = function () {
    try {
        this.request = new XMLHttpRequest();
        var bind = this; //this.request.onreadystatechange = this.SignInCallback;

        this.request.onreadystatechange = function () {
            bind.SignInCallback();
        }; //this.request.ontimeout = this.SignInTimeout;


        this.request.ontimeout = function () {
            bind.SignInTimeout();
        };

        this.request.open("GET", this.server + "/sign_in?" + this.localName, true);
        this.request.send();
    } catch (e) {
        console.log("error signIn: " + e.description);
    }
};

WebRtcStreamer.prototype.SignInTimeout = function () {
    console.log("error signtimeout");
};

WebRtcStreamer.prototype.SignInCallback = function () {
    try {
        if (this.request.readyState == 4) {
            if (this.request.status == 200) {
                var peers = this.request.responseText.split("\n");
                this.myId = parseInt(peers[0].split(',')[1]);

                for (var i = 1; i < peers.length; ++i) {
                    if (peers[i].length > 0) {
                        console.log("Peer " + i + ": " + peers[i]);
                        var parsed = peers[i].split(',');

                        if (parsed[0] == this.remoteName) {
                            this.otherId = parseInt(parsed[1]);
                            this.startWebrtc();
                            break;
                        }
                    }
                }

                this.startHangingGet();
                this.request = null;
            } else {
                console.log("My : " + this.request.responseText);
            }
        }
    } catch (e) {
        console.log("error signInCallback: " + e.description);
    }
};
/*******************handle message from server************************/


WebRtcStreamer.prototype.startHangingGet = function () {
    try {
        this.hangingGet = new XMLHttpRequest();
        var bind = this; //this.hangingGet.onreadystatechange = this.hangingGetCallback;

        this.hangingGet.onreadystatechange = function () {
            bind.hangingGetCallback();
        }; //this.hangingGet.ontimeout = this.onHangingGetTimeout;


        this.hangingGet.ontimeout = function () {
            bind.onHangingGetTimeout();
        };

        this.hangingGet.open("GET", this.server + "/wait?peer_id=" + this.myId, true);
        this.hangingGet.send();
    } catch (e) {
        console.log("error startHangingGet" + e.description);
    }
};

WebRtcStreamer.prototype.onHangingGetTimeout = function () {
    console.log("error startHangingGet");
};

WebRtcStreamer.prototype.hangingGetCallback = function () {
    try {
        if (this.hangingGet.readyState == 4) {
            if (this.hangingGet.status != 200) {
                console.log("server is not 200 error: " + this.hangingGet.statusText);
                this.disconnect();
            } else {
                var peer_id = this.parseIntHeader(this.hangingGet, "Pragma");
                console.log("Message from:", peer_id, ':', this.hangingGet.responseText);

                if (peer_id == this.myId) {
                    console.log("2222222");
                    this.handleServerNotification(this.hangingGet.responseText);
                } else {
                    if (peer_id == this.otherId) {
                        console.log("333333333");
                        this.handlePeerMessage(this.otherId, this.hangingGet.responseText);
                        console.log("444444444");
                    } else {
                        console.log("this is not message from otherId");
                    }
                }
            }

            if (this.hangingGet) {
                this.hangingGet.abort();
                this.hangingGet = null;
            }

            console.log("55555");

            if (this.myId != -1) {
                var bind = this;
                window.setTimeout(function () {
                    bind.startHangingGet();
                }, 0);
            }
        }
    } catch (e) {
        console.log("Hanging get error: " + e.description);
    }
};

WebRtcStreamer.prototype.parseIntHeader = function (r, name) {
    var val = r.getResponseHeader(name);
    return val != null && val.length ? parseInt(val) : -1;
};

WebRtcStreamer.prototype.handleServerNotification = function (data) {
    console.log("Server notification: " + data);
    var parsed = data.split(',');

    if (parseInt(parsed[2]) != 0 && this.otherId != -1) {
        if (parsed[0] == this.remoteName) {
            this.otherId = parseInt(parsed[1]);
        }
    }
};

WebRtcStreamer.prototype.handlePeerMessage = function (peer_id, data) {
    var str = "Message from '" + peer_id + ":" + data;
    console.log(str);
    var dataJson = JSON.parse(data);
    console.log("received ", dataJson);

    if (data.search("answer") != -1) {
        console.log("Adding answer"); //this.pc.setRemoteDescription(new RTCSessionDescription(dataJson),this.onRemoteSdpSucces,this.onRemoteSdpError);

        this.pc.setRemoteDescription(new RTCSessionDescription(dataJson)).then(function () {
            console.log("setRemoteDescription Succes");
        }).catch(function (error) {
            console.log("setRemoteDescription Failure" + error.name);
        });
    } else {
        console.log("Adding ICE candiate ", dataJson);
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: dataJson.sdpMLineIndex,
            candidate: dataJson.candidate
        }); //this.pc.addIceCandidate(candidate, this.aic_success_cb, this.aic_failure_cb);

        this.pc.addIceCandidate(candidate).then(function () {
            console.log("addIceCandidate Succes");
        }).catch(function (error) {
            console.log("Failure during addIceCandidate(): " + error.name);
        });
    }
};
/******************************werbrtc handle and send message to server*****************************/


WebRtcStreamer.prototype.sendToPeer = function (data) {
    try {
        console.log(" Send ", data);

        if (this.myId == -1) {
            console.log("server Not connected");
            return;
        }

        if (this.otherId == this.myId) {
            console.log("Can't send a message to oneself :)");
            return;
        }

        var r = new XMLHttpRequest();
        var bind = this;

        r.onreadystatechange = function () {
            bind.dummy();
        };

        r.open("POST", this.server + "/message?peer_id=" + this.myId + "&to=" + this.otherId, true);
        r.setRequestHeader("Content-Type", "text/plain");
        r.send(data);
    } catch (e) {
        console.log("send to peer error: " + e.description);
    }
};

WebRtcStreamer.prototype.dummy = function () {
    console.log("dummy");
};

WebRtcStreamer.prototype.startWebrtc = function () {
    if (this.myId == -1) {
        console.log("event_connect_server_failure");

        if (this.event_connect_server_failure) {
            this.event_connect_server_failure();
        }

        return;
    } else if (this.otherId == -1) {
        console.log("event_device_find_failure");

        if (this.event_device_find_failure) {
            this.event_device_find_failure();
        }

        return;
    }

    this.createPeerConnection();
    var bind = this;
    var promise = this.pc.createOffer(this.mediaConstraints).then(function (sessionDescription) {
        return bind.pc.setLocalDescription(sessionDescription);
    }).catch(function (error) {
        console.log("Create offer error:" + error);
    });

    if (promise) {
        promise.then(function () {
            var data = JSON.stringify(bind.pc.localDescription);
            console.log("setLocalDescription success " + data);
            bind.sendToPeer(data);
        }).catch(function (error) {
            console.log("setLocalDescription error:" + error);
        });
    }
};

WebRtcStreamer.prototype.createPeerConnection = function () {
    this.pc = new RTCPeerConnection(this.pcConfig, this.pcOptions);

    if (this.browserinfo.browser == "safari") {
        console.log("safari..........");
        this.pc.addTransceiver("video");
    }

    var bind = this; //this.pc.onicecandidate = this.Onicecandidate;

    this.pc.onicecandidate = function (event) {
        bind.Onicecandidate(event);
    }; //this.pc.onaddstream = this.Onaddstream;


    if (this.browserinfo.browser == "chrome" && parseInt(this.browserinfo.version) < 64) {
        this.pc.onaddstream = function (event) {
            bind.onaddstream(event);
        };
    } else {
        this.pc.ontrack = function (event) {
            bind.ontrack(event);
        };
    } //this.pc.oniceconnectionstatechange = this.Oniceconnectionstatechange;


    this.pc.oniceconnectionstatechange = function (event) {
        bind.Oniceconnectionstatechange(event);
    };
};

WebRtcStreamer.prototype.Onicecandidate = function (event) {
    if (event.candidate) {
        console.log("get candidates Onicecandidate");
        var candidate = {
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        };
        this.sendToPeer(JSON.stringify(candidate));
    } else {
        console.log("End of candidates.");
    }
};

WebRtcStreamer.prototype.onaddstream = function (event) {
    console.log("Remote onaddstream track added:" + JSON.stringify(event));
    var videoElement = document.getElementById(this.videoElement);
    videoElement.srcObject = event.stream;
    videoElement.setAttribute("playsinline", true);
    videoElement.muted = true;
    videoElement.play();
};

WebRtcStreamer.prototype.ontrack = function (event) {
    console.log("Remote ontrack track added:" + JSON.stringify(event));
    var videoElement = document.getElementById(this.videoElement);
    videoElement.srcObject = event.streams[0];
    videoElement.setAttribute("playsinline", true);
    videoElement.muted = true;
    videoElement.play();
};

WebRtcStreamer.prototype.Oniceconnectionstatechange = function (event) {
    console.log("this.pc.iceConnectionState " + this.pc.iceConnectionState);

    if (this.pc.iceConnectionState === "checking" || this.pc.iceConnectionState === "new") {
        console.log(_typeof(this.event_stream_wait));

        if (typeof this.event_stream_wait == 'function') {
            this.event_stream_wait();
        }
    }

    if (this.pc.iceConnectionState === "connected") {
        console.log(_typeof(this.event_stream_good));

        if (typeof this.event_stream_good == 'function') {
            this.event_stream_good();
        }
    } else if (this.pc.iceConnectionState === "disconnected" || this.pc.iceConnectionState === "failed") {
        if (typeof this.event_stream_wait == 'function') {
            this.event_stream_wait();
        }
    } else if (this.pc.iceConnectionState === "closed") {
        if (typeof this.event_stream_close == 'function') {
            this.event_stream_close();
        }
    }
};

WebRtcStreamer.prototype.disconnect = function () {
    if (this.request) {
        this.request.abort();
        this.request = null;
    }

    if (this.hangingGet) {
        this.hangingGet.abort();
        this.hangingGet = null;
    }

    if (this.myId != -1) {
        this.request = new XMLHttpRequest();
        this.request.open("GET", this.server + "/sign_out?peer_id=" + this.myId, false);
        this.request.send();
        this.request = null;
        this.myId = -1;
        this.otherId = -1;

        if (this.pc) {
            this.pc.close();
        }
    }
};

WebRtcStreamer.prototype.start = function () {
    this.detectBrowser(window);
    this.ConnectToServer(); // var bind = this;
    // window.setTimeout(function () {
    //     bind.startWebrtc(); //1s后，改变isEnd的值
    // }, 500);
};
