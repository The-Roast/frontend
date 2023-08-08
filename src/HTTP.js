const encodeURL = (data) => {
	var formBody = [];
	for (var property in data) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(data[property]);
		formBody.push(encodedKey + "=" + encodedValue);
	}
	formBody = formBody.join("&");
	return formBody;
};
var SimpleCrypto = require("simple-crypto-js").default;
const SECRET_KEY =
	"}{tRDrz%OZU&c7[li/|lKv(E]VaAjT{I'Cq*i/H=ZTZ,h1TU:VGf@~cfySD|!dYc";

const simpleCrypto = new SimpleCrypto(SECRET_KEY);
const BACKEND_URL = "http://127.0.0.1:8000";

export { encodeURL, simpleCrypto, BACKEND_URL };
