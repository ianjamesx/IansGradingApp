/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />

import render = require('../utils/')

let error = (div: string, message: string) => {
    let content = render.error(message);
    $('#' + div).html(content);
};