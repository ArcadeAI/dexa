#!/usr/bin/env node
import { createAgent } from '@dexa/agent';
const agent = createAgent();
console.log('DEXA CLI');
agent.run().then(r => console.log(r));
