#!/usr/bin/env node
import {translate} from "./main";

const {Command} = require('commander');
const program = new Command();

program
    .name('translate_chili')
    .version('0.0.1')
    .usage('<English>')
    .argument('<English>')
    .action((word: string) => {
        translate(word)
    });

program.parse();