import { createAgent } from '@dexa/agent';
const agent = createAgent();
export async function main() {
  console.log('API starting');
  console.log('Agent says:', await agent.run());
}
if (import.meta.main) main();
