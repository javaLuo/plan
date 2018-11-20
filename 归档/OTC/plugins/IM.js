import websdk from "easemob-websdk";

let webIM = (window.WebImM = websdk);
let conn = new webIM.connection({
	isMultiLoginSessions: webIM.config.isMultiLoginSessions,
	https:
		typeof webIM.config.https === "boolean" ? webIM.config.https : location.protocol === "https:",
	url: webIM.config.xmppURL,
	isAutoLogin: true,
	heartBeatWait: webIM.config.heartBeatWait,
	autoReconnectNumMax: webIM.config.autoReconnectNumMax,
	autoReconnectInterval: webIM.config.autoReconnectInterval,
	apiUrl: webIM.config.apiURL
});

export { webIM, conn };
