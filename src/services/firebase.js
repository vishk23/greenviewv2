"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = exports.fetchEvents = exports.db = exports.auth = exports.app = void 0;
// /src/services/firebase.ts
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var analytics_1 = require("firebase/analytics");
var firestore_1 = require("firebase/firestore");
var firestore_2 = require("firebase/firestore");
var vertexai_1 = require("firebase/vertexai");
var firebaseConfig = {
    apiKey: "AIzaSyA76-eQ_ty741J84AZUJRVeQ-WF2xiPXbk",
    authDomain: "greenviewv2.firebaseapp.com",
    projectId: "greenviewv2",
    storageBucket: "greenviewv2.appspot.com",
    messagingSenderId: "531785495551",
    appId: "1:531785495551:web:08ab7fd8c889a7271badca",
    measurementId: "G-N94JNCJXMB"
};
// Initialize Firebase
exports.app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(exports.app);
if (typeof window !== 'undefined') {
    (0, analytics_1.isSupported)().then(function (supported) {
        if (supported) {
            (0, analytics_1.getAnalytics)(exports.app);
        }
    });
}
exports.db = (0, firestore_1.getFirestore)(exports.app);
// Initialize the Vertex AI service
var vertexAI = (0, vertexai_1.getVertexAI)(exports.app);
function fetchEvents(params) {
    if (params === void 0) { params = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var eventsCollection, q, eventSnapshot, eventsList, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(params);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    eventsCollection = (0, firestore_2.collection)(exports.db, 'events');
                    q = (0, firestore_2.query)(eventsCollection);
                    if (params.startDate) {
                        q = (0, firestore_2.query)(q, (0, firestore_2.where)('start', '>=', params.startDate));
                    }
                    if (params.endDate) {
                        q = (0, firestore_2.query)(q, (0, firestore_2.where)('end', '<=', params.endDate));
                    }
                    if (params.location) {
                        q = (0, firestore_2.query)(q, (0, firestore_2.where)('location', '==', params.location));
                    }
                    if (params.title) {
                        q = (0, firestore_2.query)(q, (0, firestore_2.where)('title', '==', params.title));
                    }
                    return [4 /*yield*/, (0, firestore_2.getDocs)(q)];
                case 2:
                    eventSnapshot = _a.sent();
                    eventsList = eventSnapshot.docs.map(function (doc) { return ({
                        id: doc.id,
                        title: doc.data().title,
                        start: doc.data().start.toDate(),
                        end: doc.data().end.toDate(),
                        location: doc.data().location || 'Location not specified',
                    }); });
                    console.log(eventsList);
                    return [2 /*return*/, eventsList];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching events: ", error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchEvents = fetchEvents;
var fetchEventsTool = {
    functionDeclarations: [
        {
            name: "fetchEvents",
            description: "Fetch upcoming sustainability events from the calendar using YYYY-MM-DD format for the start and (optionally) end dates.",
            parameters: vertexai_1.Schema.object({
                type: vertexai_1.SchemaType.OBJECT,
                properties: {
                    startDate: vertexai_1.Schema.string({
                        description: "The start date for the event query in YYYY-MM-DD format.",
                        nullable: true,
                    }),
                    endDate: vertexai_1.Schema.string({
                        description: "The end date for the event query in YYYY-MM-DD format.",
                        nullable: true,
                    }), /*
                    location: Schema.string({
                      description: "The location of the event.",
                      nullable: true,
                    }),
                    title: Schema.string({
                      description: "The title of the event.",
                      nullable: true,
                    }),*/
                },
            }),
        },
    ],
};
// Initialize the generative model with system instructions
exports.model = (0, vertexai_1.getGenerativeModel)(vertexAI, {
    model: "gemini-1.5-flash",
    tools: [fetchEventsTool], // Wrap fetchEventsTool in an array
    systemInstruction: "You are a sustainability expert chatbot designed to help students adopt more sustainable practices. Provide advice and tips on sustainability in a friendly and informative manner.",
});
