"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
//   import jsonData from './en_thesaurus.json'  assert { type: WordData[] };
// Read the JSON file synchronously (you can use asynchronous read if preferred)
var jsonDataFilePath = './en_thesaurus.json'; // Replace with your file path
var jsonData = JSON.parse((0, fs_1.readFileSync)(jsonDataFilePath, 'utf-8'));
var WordGraph = /** @class */ (function () {
    function WordGraph() {
        this.adjacencyList = new Map();
    }
    WordGraph.prototype.addWord = function (word, synonyms) {
        if (this.adjacencyList.has(word)) {
            var existingSynonyms = this.adjacencyList.get(word);
            if (existingSynonyms) {
                var updatedSynonyms = __spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(existingSynonyms), false), __read(synonyms), false))), false);
                this.adjacencyList.set(word, updatedSynonyms);
            }
        }
        else {
            this.adjacencyList.set(word, synonyms);
        }
    };
    WordGraph.prototype.getSynonyms = function (word) {
        return this.adjacencyList.get(word);
    };
    WordGraph.prototype.hasPathWithMinLength = function (word, minLength) {
        var _this = this;
        var visited = {};
        var memo = {};
        var dfs = function (node, length) {
            var e_1, _a;
            var key = "".concat(node, "-").concat(length);
            if (memo[key] !== undefined) {
                return memo[key];
            }
            if (length >= minLength) {
                memo[key] = true;
                return true;
            }
            visited[node] = true;
            var synonyms = _this.adjacencyList.get(node);
            if (synonyms) {
                try {
                    for (var synonyms_1 = __values(synonyms), synonyms_1_1 = synonyms_1.next(); !synonyms_1_1.done; synonyms_1_1 = synonyms_1.next()) {
                        var synonym = synonyms_1_1.value;
                        if (!visited[synonym]) {
                            if (dfs(synonym, length + 1)) {
                                memo[key] = true;
                                return true;
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (synonyms_1_1 && !synonyms_1_1.done && (_a = synonyms_1.return)) _a.call(synonyms_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            visited[node] = false;
            memo[key] = false;
            return false;
        };
        return dfs(word, 0);
    };
    WordGraph.prototype.findShortestPathLength = function (start, end) {
        var e_2, _a;
        if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
            return null; // Start or end word not in graph
        }
        if (start === end) {
            return 0; // Start and end are the same
        }
        var queue = [{ word: start, length: 0 }];
        var visited = new Set();
        while (queue.length > 0) {
            var _b = queue.shift(), word = _b.word, length_1 = _b.length;
            if (word === end) {
                return length_1; // Path found
            }
            visited.add(word);
            var synonyms = this.adjacencyList.get(word);
            if (synonyms) {
                try {
                    for (var synonyms_2 = (e_2 = void 0, __values(synonyms)), synonyms_2_1 = synonyms_2.next(); !synonyms_2_1.done; synonyms_2_1 = synonyms_2.next()) {
                        var synonym = synonyms_2_1.value;
                        if (!visited.has(synonym)) {
                            queue.push({ word: synonym, length: length_1 + 1 });
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (synonyms_2_1 && !synonyms_2_1.done && (_a = synonyms_2.return)) _a.call(synonyms_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        return null; // No path found
    };
    WordGraph.prototype.findShortestPathLengthBiDirectional = function (start, end) {
        var e_3, _a, e_4, _b;
        if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
            return null;
        }
        if (start === end) {
            return 0;
        }
        var queueStart = [{ word: start, length: 0 }];
        var queueEnd = [{ word: end, length: 0 }];
        var visitedStart = new Map(); // Use Map to store lengths
        var visitedEnd = new Map(); // Use Map to store lengths
        visitedStart.set(start, 0);
        visitedEnd.set(end, 0);
        while (queueStart.length > 0 && queueEnd.length > 0) {
            var currentStart = queueStart.shift();
            if (visitedEnd.has(currentStart.word)) {
                return currentStart.length + visitedEnd.get(currentStart.word);
            }
            var synonymsStart = this.adjacencyList.get(currentStart.word);
            if (synonymsStart) {
                try {
                    for (var synonymsStart_1 = (e_3 = void 0, __values(synonymsStart)), synonymsStart_1_1 = synonymsStart_1.next(); !synonymsStart_1_1.done; synonymsStart_1_1 = synonymsStart_1.next()) {
                        var synonym = synonymsStart_1_1.value;
                        if (!visitedStart.has(synonym)) {
                            visitedStart.set(synonym, currentStart.length + 1);
                            queueStart.push({ word: synonym, length: currentStart.length + 1 });
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (synonymsStart_1_1 && !synonymsStart_1_1.done && (_a = synonymsStart_1.return)) _a.call(synonymsStart_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            var currentEnd = queueEnd.shift();
            if (visitedStart.has(currentEnd.word)) {
                return currentEnd.length + visitedStart.get(currentEnd.word);
            }
            var synonymsEnd = this.adjacencyList.get(currentEnd.word);
            if (synonymsEnd) {
                try {
                    for (var synonymsEnd_1 = (e_4 = void 0, __values(synonymsEnd)), synonymsEnd_1_1 = synonymsEnd_1.next(); !synonymsEnd_1_1.done; synonymsEnd_1_1 = synonymsEnd_1.next()) {
                        var synonym = synonymsEnd_1_1.value;
                        if (!visitedEnd.has(synonym)) {
                            visitedEnd.set(synonym, currentEnd.length + 1);
                            queueEnd.push({ word: synonym, length: currentEnd.length + 1 });
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (synonymsEnd_1_1 && !synonymsEnd_1_1.done && (_b = synonymsEnd_1.return)) _b.call(synonymsEnd_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        return null;
    };
    WordGraph.prototype.findLongestPath = function (startNode) {
        var _this = this;
        var memo = new Map();
        var dfs = function (node) {
            var e_5, _a;
            if (memo.has(node)) {
                return memo.get(node);
            }
            var maxLength = 0;
            var synonyms = _this.adjacencyList.get(node);
            if (synonyms) {
                try {
                    for (var synonyms_3 = __values(synonyms), synonyms_3_1 = synonyms_3.next(); !synonyms_3_1.done; synonyms_3_1 = synonyms_3.next()) {
                        var synonym = synonyms_3_1.value;
                        var length_2 = dfs(synonym) + 1;
                        maxLength = Math.max(maxLength, length_2);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (synonyms_3_1 && !synonyms_3_1.done && (_a = synonyms_3.return)) _a.call(synonyms_3);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            memo.set(node, maxLength);
            return maxLength;
        };
        return dfs(startNode);
    };
    WordGraph.prototype.findNodesWithMinPathLength = function (minLength) {
        var e_6, _a;
        var _this = this;
        var nodesWithMinPath = [];
        var dfs = function (node, length, visited) {
            var e_7, _a;
            visited[node] = true;
            if (length >= minLength) {
                nodesWithMinPath.push(node);
                return;
            }
            var synonyms = _this.adjacencyList.get(node);
            if (synonyms) {
                try {
                    for (var synonyms_4 = __values(synonyms), synonyms_4_1 = synonyms_4.next(); !synonyms_4_1.done; synonyms_4_1 = synonyms_4.next()) {
                        var synonym = synonyms_4_1.value;
                        if (!visited[synonym]) {
                            dfs(synonym, length + 1, visited);
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (synonyms_4_1 && !synonyms_4_1.done && (_a = synonyms_4.return)) _a.call(synonyms_4);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            visited[node] = false;
        };
        try {
            for (var _b = __values(this.adjacencyList.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                var visited = {};
                dfs(node, 0, visited);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return nodesWithMinPath;
    };
    WordGraph.prototype.printGraph = function () {
        var e_8, _a;
        try {
            for (var _b = __values(this.adjacencyList.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), word = _d[0], synonyms = _d[1];
                console.log("".concat(word, " -> ").concat(synonyms.join(', ')));
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    WordGraph.prototype.findPath = function (start, end) {
        var e_9, _a;
        if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
            return null; // Start or end word not in graph
        }
        var queue = [{ word: start, path: [start] }];
        var visited = new Set();
        while (queue.length > 0) {
            var _b = queue.shift(), word = _b.word, path_1 = _b.path;
            if (word === end) {
                return path_1; // Path found
            }
            visited.add(word);
            var synonyms = this.adjacencyList.get(word);
            if (synonyms) {
                try {
                    for (var synonyms_5 = (e_9 = void 0, __values(synonyms)), synonyms_5_1 = synonyms_5.next(); !synonyms_5_1.done; synonyms_5_1 = synonyms_5.next()) {
                        var synonym = synonyms_5_1.value;
                        if (!visited.has(synonym)) {
                            queue.push({ word: synonym, path: __spreadArray(__spreadArray([], __read(path_1), false), [synonym], false) });
                        }
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (synonyms_5_1 && !synonyms_5_1.done && (_a = synonyms_5.return)) _a.call(synonyms_5);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            }
        }
        return null; // No path found
    };
    WordGraph.prototype.printPath = function (start, end) {
        var path = this.findPath(start, end);
        if (path) {
            console.log("Path from ".concat(start, " to ").concat(end, ": ").concat(path.join(" -> ")));
        }
        else {
            console.log("No path found from ".concat(start, " to ").concat(end));
        }
    };
    return WordGraph;
}());
// Example usage:
var wordGraph = new WordGraph();
while (jsonData.length > 0) {
    var w = jsonData.pop();
    if (w) {
        wordGraph.addWord(w.word, w.synonyms);
    }
}
function printEveryFour(arr) {
    if (!Array.isArray(arr)) {
        console.error("Input must be an array.");
        return;
    }
    // Create a copy to avoid modifying the original array
    var arrCopy = __spreadArray([], __read(arr), false).sort();
    while (arrCopy.length > 0) {
        var chunk = arrCopy.splice(0, 4); // Extract up to 4 elements
        console.log(chunk.join(", ")); // Print the chunk on a new line
    }
}
// wordGraph.printGraph()
// console.log(wordGraph.findNodesWithMinPathLength(6))
var game = {
    "start": "accomplished",
    "end": "industrious"
};
console.log(game);
console.log('steps left', wordGraph.findShortestPathLengthBiDirectional(game.start, game.end));
printEveryFour(wordGraph.getSynonyms(game.start));
// console.log(wordGraph.printPath(game.start, game.end))
var path = [game.start];
var rl = require("readline-sync");
var more = 1;
read();
function read() {
    var _a;
    while (more) {
        var answer = rl.question("Enter a synonym or 1 for the answer\n");
        if ((_a = wordGraph.getSynonyms(answer)) === null || _a === void 0 ? void 0 : _a.includes(game.end)) {
            more = 0;
            console.log("you win");
        }
        else {
            if (answer === '1') {
                console.log(wordGraph.printPath(game.start, game.end));
            }
            else {
                more++;
                console.clear();
                path.push(answer);
                console.log(path.join('-> '));
                console.log('end: ', game.end);
                console.log('steps left', wordGraph.findShortestPathLengthBiDirectional(answer, game.end));
                console.log("Synonyms of ".concat(answer));
                printEveryFour(wordGraph.getSynonyms(answer));
            }
        }
    }
}
